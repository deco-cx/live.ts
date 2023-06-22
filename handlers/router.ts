import { Handler } from "$live/blocks/handler.ts";
import { Routes } from "../flags/audience.ts";
import { router } from "./routesSelection.ts";

export interface RouterConfig {
  base?: string;
  routes: Routes;
}

export default function Router({
  routes: entrypoints,
  base,
}: RouterConfig): Handler {
  let routes = entrypoints;

  if (base) {
    routes = [];
    for (const route of routes) {
      const { pathTemplate: entrypoint, handler } = route;
      routes = [
        ...routes,
        { pathTemplate: `${base}${entrypoint}`, handler },
      ];
    }
  }

  return router(routes);
}
