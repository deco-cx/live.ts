import { HandlerContext, Handlers, PageProps } from "$fresh/server.ts";
import {
  DecoManifest,
  LiveOptions,
  Mode,
  PageComponentData,
} from "$live/types.ts";
import InspectVSCodeHandler from "https://deno.land/x/inspect_vscode@0.0.5/handler.ts";
import getSupabaseClient from "$live/supabase.ts";
import { authHandler } from "$live/auth.tsx";
import { createServerTiming } from "$live/utils/serverTimings.ts";
import {
  componentsPreview,
  renderComponent,
  updateComponentProps,
} from "$live/editor.tsx";
import EditorListener from "./src/EditorListener.tsx";
import { getComponentModule } from "./utils/component.ts";
import type { ComponentChildren, ComponentType } from "preact";
import type { Props as EditorProps } from "./src/Editor.tsx";
import {
  getDefaultDomains,
  getLiveOptions,
  getManifest,
  isPrivateDomain,
  pushDefaultDomains,
  setLiveOptions,
  setManifest,
} from "./context.ts";

const deploymentId = Deno.env.get("DENO_DEPLOYMENT_ID");
const isDenoDeploy = deploymentId !== undefined;

export const setupLive = (manifest: DecoManifest, liveOptions: LiveOptions) => {
  setManifest(manifest);

  pushDefaultDomains(
    `${liveOptions.site}.deco.page`,
    `deco-pages-${liveOptions.site}.deno.dev`,
  );

  // Support deploy preview domains
  if (deploymentId) {
    pushDefaultDomains(
      `deco-pages-${liveOptions.site}-${deploymentId}.deno.dev`,
    );
  }

  const userDomains = liveOptions.domains || [];
  setLiveOptions({
    ...liveOptions,
    domains: [...getDefaultDomains(), ...userDomains],
  });
};

export interface LivePageData {
  components: PageComponentData[];
  mode: Mode;
  template: string;
}

export interface LoadLiveComponentsOptions {
  template?: string;
}

export async function loadLiveComponents(
  req: Request,
  _: HandlerContext<any>,
  options?: LoadLiveComponentsOptions,
): Promise<LivePageData> {
  const liveOptions = getLiveOptions();
  const site = liveOptions.site;
  const url = new URL(req.url);
  const { template } = options ?? {};

  /**
   * Queries follow PostgREST syntax
   * https://postgrest.org/en/stable/api.html#horizontal-filtering-rows
   */
  const queries = [url.pathname, template]
    .filter((query) => Boolean(query))
    .map((query) => `path.eq.${query}`)
    .join(",");

  const { data: Pages, error } = await getSupabaseClient()
    .from("pages")
    .select(`components, path, site!inner(name, id)`)
    .eq("site.name", site)
    .or(queries);

  if (error) {
    console.log("Error fetching page:", error);
  } else {
    console.log("Found page:", Pages);
  }

  if (!liveOptions.siteId && Pages?.[0]?.site) {
    liveOptions.siteId = Pages?.[0]?.site.id;
  }

  const isEditor = url.searchParams.has("editor");

  return {
    components: Pages?.[0]?.components ?? [],
    mode: isEditor ? "edit" : "none",
    template: options?.template || url.pathname,
  };
}

interface CreateLivePageOptions<LoaderData> {
  loader?: (
    req: Request,
    ctx: HandlerContext<LoaderData>,
  ) => Promise<LoaderData>;
}

export function createLiveHandler<LoaderData = LivePageData>(
  options?: CreateLivePageOptions<LoaderData> | LoadLiveComponentsOptions,
) {
  const { loader } = (options ?? {}) as CreateLivePageOptions<LoaderData>;

  const handler: Handlers<LoaderData | LivePageData> = {
    async GET(req, ctx) {
      const url = new URL(req.url);
      // TODO: Find a better way to embedded this route on project routes.
      // Follow up here: https://github.com/denoland/fresh/issues/516
      // TODO: Protect these endpoints
      if (url.pathname === "/live/api/components") {
        return componentsPreview(url, "components");
      }
      if (url.pathname === "/live/api/islands") {
        return componentsPreview(url, "islands");
      }
      if (
        url.pathname.startsWith("/live/api/islands/") ||
        url.pathname.startsWith("/live/api/components/")
      ) {
        const componentName = url.pathname.split("/").pop() ?? "";

        return renderComponent(url, componentName);
      }

      const { start, end, printTimings } = createServerTiming();
      const liveOptions = getLiveOptions();
      const domains: string[] = liveOptions.domains || [];

      if (!domains.includes(url.hostname)) {
        console.log("Domain not found:", url.hostname);
        console.log("Configured domains:", domains);

        // TODO: render custom 404 page
        return new Response("Site not found", { status: 404 });
      }

      if (url.pathname === "/live/proxy/gtag/js") {
        const trackingId = url.searchParams.get("id");
        console.log("Proxying gtag", trackingId);
        return fetch(
          `https://www.googletagmanager.com/gtag/js?id=${trackingId}`,
        );
      }

      start("fetch-page-data");
      let loaderData = undefined;

      try {
        if (typeof loader === "function") {
          loaderData = await loader(req, ctx);
        } else {
          loaderData = await loadLiveComponents(
            req,
            ctx,
            options as LoadLiveComponentsOptions,
          );
        }
      } catch (error) {
        console.log("Error running loader. \n", error);
        // TODO: Do a better error handler. Maybe redirect to 500 page.
      }

      end("fetch-page-data");

      start("render");
      const res = await ctx.render(loaderData);
      end("render");

      res.headers.set("Server-Timing", printTimings());

      return res;
    },
    async POST(req, ctx) {
      const url = new URL(req.url);
      if (url.pathname === "/inspect-vscode" && !isDenoDeploy) {
        return await InspectVSCodeHandler.POST!(req, ctx);
      }
      if (url.pathname === "/live/api/credentials") {
        return await authHandler.POST!(req, ctx);
      }
      if (url.pathname === "/live/api/editor") {
        return await updateComponentProps(req, ctx);
      }

      return new Response("Not found", { status: 404 });
    },
  };

  return handler;
}

export function LiveComponents(
  { components }: LivePageData,
) {
  const manifest = getManifest();
  return (
    <div class="relative w-full">
      {components?.map(({ component, props }: PageComponentData) => {
        const Comp = getComponentModule(manifest, component)?.default;

        return <Comp {...props} />;
      })}
    </div>
  );
}

export function LivePage(
  { data, children, ...otherProps }: PageProps<LivePageData> & {
    children: ComponentChildren;
  },
) {
  const manifest = getManifest();
  const InspectVSCode = !isDenoDeploy &&
    manifest.islands[`./islands/InspectVSCode.tsx`]?.default;
  const Editor: ComponentType<EditorProps> = manifest
    .islands[`./islands/Editor.tsx`]
    ?.default;

  if (!Editor) {
    console.log("Missing Island: ./island/Editor.tsx");
  }

  const renderEditor = Boolean(Editor) && data.mode === "edit";
  const privateDomain = isPrivateDomain(otherProps.url.hostname);
  const componentSchemas = manifest.schemas;

  return (
    <div class="flex">
      {children ? children : <LiveComponents {...data} />}
      {renderEditor && privateDomain
        ? (
          <Editor
            components={data.components}
            template={data.template}
            componentSchemas={componentSchemas}
          />
        )
        : null}
      {privateDomain && <EditorListener />}
      {InspectVSCode ? <InspectVSCode /> : null}
    </div>
  );
}
