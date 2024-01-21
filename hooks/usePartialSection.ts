import { CLIENT_NAV_ATTR, PARTIAL_ATTR } from "$fresh/src/constants.ts";
import { useContext } from "preact/hooks";
import { ComponentType } from "preact";
import { IS_BROWSER } from "deco/deps.ts";
import { FieldResolver } from "deco/engine/core/resolver.ts";
import { SectionContext } from "deco/components/section.tsx";

type Options<P> = {
  /** Section props partially applied */
  props?: Partial<P extends ComponentType<infer K> ? K : P>;

  /** Path where section is to be found */
  href?: string;

  /** Section name to render. Defaults to current section */
  resolveType?: string;
};

export const useSection = <P>({ props = {}, href }: Options<P> = {}) => {
  const ctx = useContext(SectionContext);

  if (IS_BROWSER) {
    throw new Error("Partials cannot be used inside an Island!");
  }

  if (!ctx) {
    throw new Error("Missing context in rendering tree");
  }

  const { request, context: { state: { pathTemplate } } } = ctx;

  const params = new URLSearchParams([
    ["props", JSON.stringify(props)],
    ["href", href ?? request.url],
    ["pathTemplate", pathTemplate],
  ]);

  if ((props as any)?.__resolveType === undefined) {
    params.set(
      "resolveChain",
      JSON.stringify(FieldResolver.minify(ctx.resolveChain.slice(0, -1))),
    );
  }

  return `/deco/render?${params}`;
};

export const usePartialSection = <P>(props: Options<P> = {}) => ({
  [CLIENT_NAV_ATTR]: true,
  [PARTIAL_ATTR]: useSection(props),
});
