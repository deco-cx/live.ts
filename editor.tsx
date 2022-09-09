import { HandlerContext } from "$fresh/server.ts";
import { renderToString } from "preact-render-to-string";
import { getSupabaseClientForUser } from "./supabase.ts";
import type { DecoManifest } from "./types.ts";
import { getComponentModule } from "./utils/component.ts";

type Options = {
  userOptions: {
    siteId: number;
  };
};

export async function updateComponentProps(
  req: Request,
  _: HandlerContext,
  { userOptions }: Options,
) {
  let status;

  try {
    const { components, template } = await req.json();

    if (!userOptions.siteId) {
      // TODO: fetch site id from supabase
    }

    // TODO: Validate components props on schema

    const res = await getSupabaseClientForUser(req).from("pages").update({
      components: components,
    }).match({ site: userOptions.siteId, path: template });

    status = res.status;
  } catch (e) {
    console.error(e);
    status = 400;
  }

  return new Response(null, { status });
}

export interface ComponentPreview {
  html: string;
  componentLabel: string;
  component: string;
}

export function componentsPreview(
  manifest: DecoManifest,
): ComponentPreview[] {
  const components = Object.entries(manifest.schemas).map(
    ([componentName, componentSchema]) => {
      const componentModule = getComponentModule(manifest, componentName);
      const Component = componentModule!.default;

      return {
        html: renderToString(<Component />),
        component: componentName,
        componentLabel: componentSchema?.title ?? componentName,
      };
    },
  );

  return components;
}
