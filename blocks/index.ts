import flagBlock from "$live/blocks/flag.ts";
import handlerBlock from "$live/blocks/handler.ts";
import islandBlock from "$live/blocks/island.ts";
import loaderBlock from "$live/blocks/loader.ts";
import matcherBlock from "$live/blocks/matcher.ts";
import pageBlock from "$live/blocks/page.ts";
import routeBlock from "$live/blocks/route.ts";
import sectionBlock from "$live/blocks/section.ts";

export default [
  loaderBlock,
  routeBlock,
  islandBlock,
  handlerBlock,
  pageBlock,
  sectionBlock,
  matcherBlock,
  flagBlock,
];
