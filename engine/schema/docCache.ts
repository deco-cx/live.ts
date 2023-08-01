import { denoDocLocalCache } from "$live/engine/schema/utils.ts";
import { decompressToJSON } from "$live/utils/zstd.ts";
import { DocNode } from "https://deno.land/x/deno_doc@0.59.0/lib/types.d.ts";

export const LOCATION_TAG = "___LOCATION___";
const getFileBinary = async (url: string): Promise<Uint8Array> => {
  const response = await fetch(url, { redirect: "follow" });
  if (response.status !== 200) {
    // ensure the body is read as to not leak resources
    await response.arrayBuffer();
    return new Uint8Array();
  }
  return new Uint8Array(await response.arrayBuffer());
};

export const loadFromBinary = (binary: Uint8Array, importedFrom: string) => {
  return decompressToJSON<Record<string, DocNode[]>>(
    binary,
    (str: string) => str.replaceAll(LOCATION_TAG, importedFrom),
  );
};

export const loadFromFile = async (filePath: string, importedFrom: string) => {
  const loader = filePath.startsWith("http") ? getFileBinary : Deno.readFile;
  return loadFromBinary(
    await loader(filePath),
    importedFrom,
  );
};

/**
 * Hydrates the cache with the zstd file content given in the filepath parameter.
 */
export const hydrateDocCacheWith = async (
  filePath: string,
  importedFrom: string,
) => {
  for (
    const [key, value] of Object.entries(
      await loadFromFile(filePath, importedFrom),
    )
  ) {
    denoDocLocalCache[
      key.replaceAll(LOCATION_TAG, importedFrom)
    ] ??= Promise.resolve(
      value,
    );
  }
};
