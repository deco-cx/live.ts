import { context } from "$live/live.ts";
import { Node } from "$live/types.ts";
import { resolveFilePath } from "$live/utils/filesystem.ts";
import { basename } from "std/path/mod.ts";

const mapSectionToNode = (component: string) => ({
  label: basename(component),
  fullPath: component,
  editLink: context.deploymentId === undefined // only allow vscode when developing locally
    ? `vscode://file/${resolveFilePath(component)}`
    : undefined,
});

const isTSXFile = (section: string) => section.endsWith(".tsx");

const isGlobalSection = (section: string) => section.endsWith(".global.tsx");

const getWorkbenchTree = (): Node[] => {
  const sections = context.manifest?.sections ?? {};
  const accounts = context?.manifest?.accounts ?? {};

  const tsxFileSections = Object
    .keys(sections)
    .filter((section) => isTSXFile(section));

  const firstLevelNonGlobalSectionNodes: Node[] = tsxFileSections.filter((
    section,
  ) => !isGlobalSection(section)).map(mapSectionToNode);

  return [{
    label: "sections",
    fullPath: "./sections",
    children: firstLevelNonGlobalSectionNodes,
  }, {
    label: "globals",
    fullPath: "./sections",
    children: Object.keys(accounts).map(mapSectionToNode),
  }];
};

export const handler = () => {
  return new Response(JSON.stringify(getWorkbenchTree()), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
};
