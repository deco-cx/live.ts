#!/usr/bin/env -S deno run -A --watch=static/,routes/
import { dirname, fromFileUrl, join, toFileUrl } from "std/path/mod.ts";
import "std/dotenv/load.ts";
import { collect } from "$fresh/src/dev/mod.ts";
import { walk } from "std/fs/walk.ts";
import { setupGithooks } from "https://deno.land/x/githooks@0.0.3/githooks.ts";
import os from "https://deno.land/x/dos@v0.11.0/mod.ts";

/**
 * This interface represents an intermediate state used to generate
 * the final manifest (in the target project's deco.gen.ts).
 *
 * The final manifest follows @DecoManifest type
 */
interface DevManifestData {
  routes: string[];
  islands: string[];
  sections: string[];
  loaders: string[];
}

const defaultManifestData: DevManifestData = {
  routes: [],
  islands: [],
  sections: [],
  loaders: [],
};

export async function dev(
  base: string,
  entrypoint: string,
  onListen?: () => void
) {
  const prevManifestData = Deno.env.get("FRSH_DEV_PREVIOUS_MANIFEST");

  const currentManifestData: DevManifestData = prevManifestData
    ? JSON.parse(prevManifestData)
    : defaultManifestData;

  const dir = dirname(fromFileUrl(base));

  const newManifestData = await generateDevManifestData(dir);

  Deno.env.set("FRSH_DEV_PREVIOUS_MANIFEST", JSON.stringify(newManifestData));

  const manifestDataChanged = !manifestDataEquals(
    currentManifestData,
    newManifestData
  );

  if (manifestDataChanged) await generate(dir, newManifestData);

  const shouldSetupGithooks = os.platform() !== "windows";

  if (shouldSetupGithooks) {
    await setupGithooks();
  }

  onListen?.();

  const entrypointHref = new URL(entrypoint, base).href;

  await import(entrypointHref);
}

// TODO: I'm double checking if we need this
// async function loadModuleForEntity(
//   dir: string,
//   entityName: string,
//   type: "loaders" | "islands" | "sections"
// ) {
//   const fileModule = await import(toFileUrl(join(dir, type, entityName)).href);

//   return fileModule;
// }

async function generateDevManifestData(dir: string): Promise<DevManifestData> {
  const [manifestFile, sections, loaders] = await Promise.all([
    collect(dir),
    collectSections(dir),
    collectLoaders(dir),
  ]);
  return {
    routes: manifestFile.routes,
    islands: manifestFile.islands,
    loaders,
    sections,
  };
}

export async function generate(directory: string, manifest: DevManifestData) {
  const { routes, islands, sections, loaders } = manifest;

  const output = `// DO NOT EDIT. This file is generated by deco.
    // This file SHOULD be checked into source version control.
    // This file is automatically updated during development when running \`dev.ts\`.

    import config from "./deno.json" assert { type: "json" };
    import { DecoManifest } from "$live/types.ts";
    ${routes.map(templates.routes.imports).join("\n")}
    ${islands.map(templates.islands.imports).join("\n")}
    ${sections.map(templates.sections.imports).join("\n")}
    ${loaders.map(templates.loaders.imports).join("\n")}

    const manifest: DecoManifest = {
      routes: {${routes.map(templates.routes.obj).join("\n")}},
      islands: {${islands.map(templates.islands.obj).join("\n")}},
      sections: {${sections.map(templates.sections.obj).join("\n")}},
      loaders: {${loaders.map(templates.loaders.obj).join("\n")}},
      baseUrl: import.meta.url,
      config,
    };

    export default manifest;
    `;

  const manifestStr = await format(output);
  const manifestPath = join(directory, "./deco.gen.ts");

  await Deno.writeTextFile(manifestPath, manifestStr);
  console.log(
    `%cThe manifest has been generated for ${routes.length} routes, ${islands.length} islands and ${sections.length} sections.`,
    "color: green; font-weight: bold"
  );
}

function manifestDataEquals(a: DevManifestData, b: DevManifestData) {
  return (
    arraysEqual(a.routes, b.routes) &&
    arraysEqual(a.islands, b.islands) &&
    arraysEqual(a.sections, b.sections) &&
    arraysEqual(a.loaders, b.loaders)
  );
}

function arraysEqual<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; ++i) {
    if (typeof a[i] === "object") {
      if (JSON.stringify(a[i]) !== JSON.stringify(b[i])) return false;

      continue;
    }

    if (a[i] !== b[i]) return false;
  }
  return true;
}

export async function format(content: string) {
  const proc = Deno.run({
    cmd: [Deno.execPath(), "fmt", "-"],
    stdin: "piped",
    stdout: "piped",
    stderr: "null",
  });

  const raw = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(content));
      controller.close();
    },
  });
  await raw.pipeTo(proc.stdin.writable);
  const out = await proc.output();
  await proc.status();
  proc.close();

  return new TextDecoder().decode(out);
}

async function collectSections(dir: string): Promise<string[]> {
  const sectionsDir = join(dir, "./sections");

  const sectionNames = await collectFilesFromDir(sectionsDir);

  return sectionNames;
}

async function collectLoaders(dir: string): Promise<string[]> {
  const loadersDir = join(dir, "./loaders");

  const loaderNames = await collectFilesFromDir(loadersDir);

  return loaderNames;
}

async function collectFilesFromDir(dir: string) {
  const files = [];
  try {
    const dirURL = toFileUrl(dir);
    // TODO(lucacasonato): remove the extranious Deno.readDir when
    // https://github.com/denoland/deno_std/issues/1310 is fixed.
    for await (const _ of Deno.readDir(dir)) {
      // do nothing
    }

    const filesFromDir = walk(dir, {
      includeDirs: false,
      includeFiles: true,
      exts: ["tsx", "jsx", "ts", "js"],
    });

    for await (const entry of filesFromDir) {
      if (entry.isFile) {
        const file = toFileUrl(entry.path).href.substring(dirURL.href.length);
        files.push(file);
      }
    }
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      // Do nothing.
    } else {
      throw err;
    }
  }
  files.sort();

  return files;
}

const templates = {
  routes: {
    imports: (file: string, i: number) =>
      `import * as $${i} from "./routes${file}";`,
    obj: (file: string, i: number) =>
      `${JSON.stringify(`./routes${file}`)}: $${i},`,
  },
  islands: {
    imports: (file: string, i: number) =>
      `import * as $$${i} from "./islands${file}";`,
    obj: (file: string, i: number) =>
      `${JSON.stringify(`./islands${file}`)}: $$${i},`,
  },
  sections: {
    imports: (file: string, i: number) =>
      `import * as $$$${i} from "./sections${file}";`,
    obj: (file: string, i: number) =>
      `${JSON.stringify(`./sections${file}`)}: $$$${i},`,
  },
  loaders: {
    imports: (file: string, i: number) =>
      `import * as $$$$${i} from "./loaders${file}";`,
    obj: (file: string, i: number) => `"./loaders${file}": $$$$${i},`,
  },
};
