import { Section } from "$live/blocks/section.ts";
import { LoaderContext } from "$live/types.ts";
import withConditions, {
  Props as ConditionalProps,
} from "$live/utils/conditionals.ts";

export interface Props {
  sections: Section[];
}

/**
 * @title Conditional Section
 */
export default function ConditionalSection(
  { sections }: Props,
) {
  if (!sections || !Array.isArray(sections)) {
    return null;
  }
  return (
    <>
      {sections.map(({ Component, props }) => <Component {...props} />)}
    </>
  ); // should this be 0?
}

export const loader = async (
  props: ConditionalProps<Section[]>,
  req: Request,
  ctx: LoaderContext,
): Promise<Props> => {
  return { sections: await withConditions(props, req, ctx) };
};
