import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { getSetCookies } from "std/http/mod.ts";
import { DECO_MATCHER_HEADER_QS } from "../blocks/matcher.ts";
import {
  getPagePathTemplate,
  redirectTo,
} from "../compatibility/v0/editorData.ts";
import { Resolvable } from "../engine/core/resolver.ts";
import { context } from "../live.ts";
import { Apps } from "../mod.ts";
import { startObserve } from "../observability/http.ts";
import { DecoSiteState, DecoState } from "../types.ts";
import { isAdmin } from "../utils/admin.ts";
import { allowCorsFor, defaultHeaders } from "../utils/http.ts";
import { formatLog } from "../utils/log.ts";

export const redirectToPreviewPage = async (url: URL, pageId: string) => {
  url.searchParams.append("path", url.pathname);
  url.searchParams.set("forceFresh", "");
  if (!url.searchParams.has("pathTemplate")) { // FIXM(mcandeia) compatibility mode only, once migrated pathTemplate is required because there are pages unpublished
    url.searchParams.append("pathTemplate", await getPagePathTemplate(pageId));
  }
  url.pathname = `/live/previews/${pageId}`;
  return redirectTo(url);
};

/**
 * @description Global configurations for ./routes/_middleware.ts route
 */
export interface MiddlewareConfig {
  /**
   * @description Configure your loaders global state.
   */
  state: Record<string, Resolvable>;
  apps?: Apps[];
}

export const isAdminOrLocalhost = (req: Request): boolean => {
  const referer = req.headers.get("origin") ?? req.headers.get("referer");
  const isOnAdmin = referer && isAdmin(referer);
  const url = new URL(req.url);
  const isLocalhost = ["localhost", "127.0.0.1"].includes(url.hostname);
  return isOnAdmin || isLocalhost;
};

export const handler = [async (
  req: Request,
  ctx: MiddlewareHandlerContext<DecoState<MiddlewareConfig, DecoSiteState>>,
) => {
  const begin = performance.now();
  const url = new URL(req.url);
  const end = startObserve();
  let response: Response | null = null;
  try {
    return response = await ctx.next();
  } finally {
    if (ctx?.state?.pathTemplate) {
      end(req.method, ctx?.state?.pathTemplate, response?.status ?? 500);
    }
    if (!url.pathname.startsWith("/_frsh")) {
      console.info(
        formatLog({
          status: response?.status ?? 500,
          url,
          begin,
        }),
      );
    }
  }
}, async (
  req: Request,
  ctx: MiddlewareHandlerContext<DecoState<MiddlewareConfig, DecoSiteState>>,
) => {
  const url = new URL(req.url);
  ctx.state.site = {
    id: context.siteId,
    name: context.site,
  };

  // FIXME (mcandeia) compatibility only.
  if (
    url.searchParams.has("editorData") &&
    !url.pathname.startsWith("/live/editorData")
  ) {
    url.pathname = "/live/editorData";
    url.searchParams.set("forceFresh", "");
    return redirectTo(url);
  }

  if (url.pathname.startsWith("/_live/workbench")) {
    url.pathname = "/live/workbench";
    return redirectTo(url);
  }

  if (
    !url.pathname.startsWith("/live/previews") &&
    url.searchParams.has("pageId") &&
    !url.searchParams.has("editorData")
  ) {
    return redirectToPreviewPage(url, url.searchParams.get("pageId")!);
  }

  const response = { headers: new Headers(defaultHeaders) };
  const state = ctx.state?.$live?.state ?? {};
  state.response = response;
  state.flags = [];
  Object.assign(ctx.state, state);
  ctx.state.global = { ...ctx.state.global ?? {}, ...state }; // compatibility mode with functions.

  const shouldAllowCorsForOptions = (req.method === "OPTIONS") &&
    isAdminOrLocalhost(req);
  const initialResponse = shouldAllowCorsForOptions
    ? new Response()
    : await ctx.next();

  // Let rendering occur — handlers are responsible for calling ctx.state.loadPage
  if (req.headers.get("upgrade") === "websocket") {
    return initialResponse;
  }
  const newHeaders = new Headers(initialResponse.headers);
  if (
    (url.pathname.startsWith("/live/previews") &&
      url.searchParams.has("mode") &&
      url.searchParams.get("mode") == "showcase") ||
    url.pathname.startsWith("/_frsh/") || shouldAllowCorsForOptions
  ) {
    Object.entries(allowCorsFor(req)).map(([name, value]) => {
      newHeaders.set(name, value);
    });
  }
  response.headers.forEach((value, key) => newHeaders.append(key, value));
  const printTimings = ctx?.state?.t?.printTimings;
  printTimings && newHeaders.set("Server-Timing", printTimings());

  if (
    url.pathname.startsWith("/_frsh/") &&
    [400, 404, 500].includes(initialResponse.status)
  ) {
    newHeaders.set("Cache-Control", "no-cache, no-store, private");
  }

  // if there's no set cookie it means that none unstable matcher was evaluated
  if (
    Object.keys(getSetCookies(newHeaders)).length === 0 &&
    Deno.env.has("DECO_ANONYMOUS_CACHE")
  ) {
    newHeaders.set("cache-control", "public, max-age=10");
  }

  for (const flag of state?.flags ?? []) {
    newHeaders.append(
      DECO_MATCHER_HEADER_QS,
      `${flag.name}=${flag.value ? 1 : 0}`,
    );
  }

  const newResponse = new Response(initialResponse.body, {
    status: initialResponse.status,
    headers: newHeaders,
  });

  return newResponse;
}];
