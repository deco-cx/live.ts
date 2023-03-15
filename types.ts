import type { HandlerContext, Manifest } from "$fresh/server.ts";
import type { IslandModule } from "$fresh/src/server/types.ts";
import flagBlock from "$live/blocks/flag.ts";
import handlerBlock from "$live/blocks/handler.ts";
import loaderBlock from "$live/blocks/loader.ts";
import matcherBlock from "$live/blocks/matcher.ts";
import pageBlock from "$live/blocks/page.ts";
import sectionBlock from "$live/blocks/section.ts";
import type { JSONSchema7, JSONSchema7Definition } from "$live/deps.ts";
import { ModuleOf } from "$live/engine/block.ts";
import { Schemas } from "$live/engine/schema/builder.ts";
import { createServerTimings } from "$live/utils/timings.ts";

export interface Node {
  label: string;
  fullPath: string;
  editLink?: string;
  children?: Node[];
}

export type JSONSchema = JSONSchema7;
export type JSONSchemaDefinition = JSONSchema7Definition;

export interface DecoManifest extends Manifest {
  islands: Record<string, IslandModule>;
  sections?: Record<string, ModuleOf<typeof sectionBlock>>;
  functions?: Record<string, ModuleOf<typeof loaderBlock>>;
  loaders?: Record<string, ModuleOf<typeof loaderBlock>>;
  pages?: Record<string, ModuleOf<typeof pageBlock>>;
  matchers?: Record<string, ModuleOf<typeof matcherBlock>>;
  handlers?: Record<string, ModuleOf<typeof handlerBlock>>;
  flags?: Record<string, ModuleOf<typeof flagBlock>>;
  schemas: Schemas;
}

export interface Site {
  id: number;
  name: string;
  thumb_url?: string;
  github_repo_url?: string;
  created_from?: Site;
  domains?: Array<{ domain: string; production: boolean }>;
}

export interface LiveOptions {
  site: string;
  siteId: number;
  loginUrl?: string;
  inspectPath?: string;
  workbenchPath?: string;
}

export interface PageSection {
  // Identifies the component uniquely in the project (e.g: "./sections/Header.tsx")
  key: string;
  // Pretty name for the entity
  label: string;
  // Uniquely identifies this entity in the scope of a page (that can have multiple functions, sections)
  uniqueId: string;
  props?: Record<string, unknown>;
}

export interface PageFunction extends PageSection {
  outputSchema?: JSONSchema;
}

export interface PageData {
  sections: PageSection[];
  functions: PageFunction[];
}

export type PageState = "archived" | "draft" | "published" | "dev" | "global";

export interface Page {
  id: number;
  data: PageData;
  name: string;
  path: string;
  state: PageState;
  site?: Site;
  public?: boolean;
}

export interface LivePageData {
  page: Page;
  flags: Flags;
}

/**
 * This type is used only on the render flow, after we matched an URL path
 * and possibly found page params (e.g: "/:slug/p" with the url "/blouse/p"
 * generates params: { slug: "blouse"})
 */
export interface PageWithParams {
  page: Page;
  params?: Record<string, string>;
}

export interface Match {
  // Identifies the MatchFunction uniquely in the project (e.g: "./functions/MatchRandom.ts")
  key: string;
  props?: Record<string, unknown>;
}
export interface Effect {
  // Identifies the EffectFunction uniquely in the project (e.g: "./functions/OverridePageEffect.ts")
  key: string;
  props?: Record<string, unknown>;
}

export interface FlagData {
  matches: Match[];
  effect?: Effect;
}

export type FlagState = "archived" | "draft" | "published";

export interface Flag<T = unknown> {
  id: string;
  name: string;
  state: FlagState;
  data: FlagData;
  site: number;
  key: string;
  value?: T;
  updated_at: string;
}

export interface Flags {
  [key: string]: unknown;
}

export type Mode = "edit" | "none";

export interface WithSchema {
  schema?: JSONSchema;
}

export type AvailableSection = Omit<PageSection, "uniqueId"> & WithSchema;
// We re-add the uniqueId here to allow user to select functions that were already
// added in the page
export type AvailableFunction = Omit<PageFunction, "uniqueId"> &
  WithSchema & { uniqueId?: string };

export interface EditorData {
  pageName: string;
  sections: Array<PageSection & WithSchema>;
  functions: Array<PageFunction & WithSchema>;
  availableSections: Array<AvailableSection>;
  availableFunctions: Array<AvailableFunction>;
  state: PageState;
}

export type LiveState<T = unknown> = {
  page: Page;
  site: Site;
  flags: Flags;
  t: Omit<ReturnType<typeof createServerTimings>, "printTimings">;
  global: T;
};

export type LoaderFunction<Props = any, Data = any, State = any> = (
  req: Request,
  ctx: HandlerContext<any, State>,
  props: Props
) => Promise<{ data: Data } & Partial<Pick<Response, "status" | "headers">>>;

export type MatchDuration = "request" | "session";

export type MatchFunction<Props = any, Data = any, State = any> = (
  req: Request,
  ctx: HandlerContext<Data, State>,
  props: Props
) => { isMatch: boolean; duration: MatchDuration };

export type EffectFunction<Props = any, Data = any, State = any> = (
  req: Request,
  ctx: HandlerContext<Data, State>,
  props: Props
) => Record<string, any>;

export type LoaderReturnType<O = unknown> = O;
