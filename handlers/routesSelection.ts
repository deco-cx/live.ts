import { Flag } from "$live/blocks/flag.ts";
import { Handler } from "$live/blocks/handler.ts";
import { MatchContext, Matcher } from "$live/blocks/matcher.ts";
import { isAwaitable } from "$live/engine/core/utils.ts";
import { Audience } from "$live/flags/audience.ts";
import { context } from "$live/live.ts";
import { ConnInfo } from "https://deno.land/std@0.170.0/http/server.ts";
import { router } from "https://deno.land/x/rutt@0.0.13/mod.ts";
import { CookiedFlag, cookies } from "../flags.ts";

export interface SelectionConfig {
  flags: Flag[]; // TODO it should be possible to specify a Flag<T> instead. author Marcos V. Candeia
}

interface AudienceFlag {
  name: string;
  matcher: Matcher;
  true: Pick<Audience, "routes" | "overrides">;
}

const isAudience = (f: Flag | AudienceFlag): f is AudienceFlag => {
  return (
    (f as AudienceFlag).true?.routes !== undefined ||
    (f as AudienceFlag).true?.overrides !== undefined
  );
};

const rankRoute = (pattern: string) =>
  pattern
    .split("/")
    .reduce(
      (acc, routePart) =>
        routePart.endsWith("*")
          ? acc
          : routePart.startsWith(":")
          ? acc + 1
          : acc + 2,
      0
    );

export type MatchWithCookieValue = MatchContext<{
  isMatchFromCookie?: boolean;
}>;
export default function RoutesSelection({ flags }: SelectionConfig): Handler {
  const audiences = flags.filter(isAudience) as AudienceFlag[];
  return async (req: Request, connInfo: ConnInfo): Promise<Response> => {
    // Read flags from cookie or start an empty map.
    const flags =
      cookies.getFlags(req.headers) ?? new Map<string, CookiedFlag>();

    // create the base match context.
    const matchCtx: Omit<MatchWithCookieValue, "isMatchFromCookie"> = {
      siteId: context.siteId,
      request: req,
    };

    // track flags that aren't on the original cookie or changed its `isMatch` property.
    const flagsThatShouldBeCookied: CookiedFlag[] = [];

    // reduce audiences building the routes and the overrides.
    const [routes, overrides] = audiences.reduce(
      ([routes, overrides], audience) => {
        // check if the audience matches with the given context considering the `isMatch` provided by the cookies.
        const isMatch = audience.matcher({
          ...matchCtx,
          isMatchFromCookie: flags.get(audience.name)?.isMatch,
        } as MatchWithCookieValue);

        // if the flag doesn't exists (e.g. new audience being used) or the `isMatch` value has changed so add as a `newFlags`
        // TODO should we track when the flag VALUE changed?
        // this code has a bug that when the isMatch doesn't change but the flag value does so the cookie will kept the old value.
        // I will not fix this for now because this shouldn't be a issue in the long run and requires deep equals between objects which could be more expansive than just assume that the value is equal.
        // as it is in 99% of the cases.
        if (
          !flags.has(audience.name) ||
          flags.get(audience.name)?.isMatch !== isMatch
        ) {
          // create the flag value
          const flagValue = {
            isMatch,
            key: audience.name,
            value: audience.true,
            updated_at: new Date().toISOString(),
          };
          // set as flag that should be cookied
          flagsThatShouldBeCookied.push(flagValue);
          // set in the current map just in case (duplicated audiences?)
          flags.set(audience.name, flagValue);
        }
        return isMatch
          ? [
              { ...routes, ...audience.true.routes },
              { ...overrides, ...audience.true.overrides },
            ]
          : [routes, overrides];
      },
      [{}, {}] as [Record<string, Handler>, Record<string, string>]
    );
    // compose the routes together
    const resolve = context.configResolver!.resolve.bind(
      context.configResolver!
    );
    const routerPromises: Promise<[string, Handler]>[] = [];
    for (const [route, handler] of Object.entries(routes)) {
      const resolvedOrPromise = resolve<Handler>(
        handler,
        { context: connInfo, request: req },
        overrides
      );
      if (isAwaitable(resolvedOrPromise)) {
        routerPromises.push(resolvedOrPromise.then((r) => [route, r]));
      } else {
        routerPromises.push(Promise.resolve([route, resolvedOrPromise]));
      }
    }
    // build the router from entries
    const builtRoutes = Object.fromEntries(
      (await Promise.all(routerPromises)).sort(([routeString]) =>
        rankRoute(routeString)
      )
    );
    const server = router(builtRoutes);

    // call the target handler
    const resp = await server(req, connInfo);

    // set cookie for the flags that has changed.
    if (flagsThatShouldBeCookied.length > 0) {
      cookies.setFlags(resp.headers, flagsThatShouldBeCookied);
    }
    return resp;
  };
}
