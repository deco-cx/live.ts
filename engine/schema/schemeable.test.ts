/// <reference no-default-lib="true"/>
/// <reference lib="deno.ns" />
/// <reference lib="esnext" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { Sha1 } from "https://deno.land/std@0.61.0/hash/sha1.ts";
import { dirname, join } from "https://deno.land/std@0.61.0/path/mod.ts";
import { assertEquals, assertObjectMatch, fail } from "std/testing/asserts.ts";

import { parsePath } from "$live/engine/schema/parser.ts";
import { schemeableToJSONSchema } from "$live/engine/schema/schemeable.ts";
import {
  Schemeable,
  typeNameToSchemeable,
} from "$live/engine/schema/transform.ts";
import { fileSeparatorToSlash } from "$live/utils/filesystem.ts";
import { fromFileUrl } from "https://deno.land/std@0.170.0/path/mod.ts";
import {
  assertSpyCall,
  assertSpyCalls,
  spy,
} from "https://deno.land/std@0.179.0/testing/mock.ts";
import { toFileUrl } from "std/path/mod.ts";

const folder = dirname(fromFileUrl(import.meta.url));
const file = "schemeable.test.types.ts";
const path = join(folder, file);
const filePath = fileSeparatorToSlash(path);

const getSchemeableFor = async (
  name: string,
): Promise<Schemeable | undefined> => {
  const ast = await parsePath(toFileUrl(path).toString());
  return await typeNameToSchemeable(name, { path, parsedSource: ast! });
};
Deno.test("Simple type generation", async () => {
  const transformed = await getSchemeableFor("SimpleType");
  if (!transformed) {
    fail("SimpleType should exists");
  }

  assertEquals(transformed, {
    file: filePath,
    jsDocSchema: {},
    name: "SimpleType",
    type: "object",
    value: {
      name: {
        title: "Name",
        required: true,
        jsDocSchema: {},
        schemeable: {
          name: "string",
          type: "inline",
          value: {
            type: "string",
          },
        },
      },
    },
  });

  const rands = [crypto.randomUUID(), crypto.randomUUID()];
  let calls = 0;

  const genId = spy((_: Schemeable) => rands[calls++]);
  const [definitions, ref] = schemeableToJSONSchema(genId, {}, transformed);
  assertEquals(ref.$ref, `#/definitions/${rands[0]}`);
  assertEquals(definitions[rands[0]], {
    allOf: undefined,
    title: "SimpleType",
    type: "object",
    properties: {
      name: {
        $ref: `#/definitions/${rands[1]}`,
        title: "Name",
      },
    },
    required: ["name"],
  });

  assertSpyCall(genId, 0, {
    args: [transformed],
    returned: rands[0],
  });
  assertSpyCall(genId, 1, {
    args: [{ type: "inline", value: { type: "string" }, name: "string" }],
    returned: rands[1],
  });

  assertSpyCalls(genId, 2);
});

Deno.test("TwoRefsProperties type generation", async () => {
  const transformed = await getSchemeableFor("TwoRefsProperties");

  if (!transformed) {
    fail("TwoRefsProperties should exists");
  }

  assertObjectMatch(transformed, {
    name: "TwoRefsProperties",
    type: "object",
    value: {
      firstRef: {
        required: true,
        schemeable: {
          name: "SimpleInterface[]",
          type: "array",
        },
        title: "First Ref",
      },
      anotherRef: {
        required: true,
        schemeable: {
          name: "SimpleInterface[]",
          type: "array",
        },
        title: "Another Ref",
      },
    },
  });

  const createHash = (input: string) => new Sha1().update(input).hex();

  /* Types:
  object_TwoRefsProperties
  array_SimpleInterface[]
  object_SimpleInterface
  inline_undefined
  array_SimpleInterface[]
  */
  const genId = (schemable: Schemeable) => {
    return createHash(schemable.type + "_" + schemable.name);
  };

  const [definitions, _] = schemeableToJSONSchema(genId, {}, transformed);

  const schemaId = createHash("object_TwoRefsProperties");

  assertObjectMatch(definitions[schemaId], {
    type: "object",
    properties: {
      firstRef: {
        "$ref": "#/definitions/f95016488720b1505d4043413c2a20ab311c47c0",
        title: "First Ref",
      },
      anotherRef: {
        "$ref": "#/definitions/f95016488720b1505d4043413c2a20ab311c47c0",
        title: "Another Ref",
      },
    },
    required: ["firstRef", "anotherRef"],
    title: "TwoRefsProperties",
  });

  //assertEquals(5, definitions.);
});

Deno.test("Simple interface generation", async () => {
  const transformed = await getSchemeableFor("SimpleInterface");
  if (!transformed) {
    fail("SimpleInterface should exists");
  }
  assertEquals(transformed, {
    extends: [],
    file: filePath,
    jsDocSchema: {},
    name: "SimpleInterface",
    type: "object",
    value: {
      name: {
        required: true,
        title: "Name",
        jsDocSchema: {},
        schemeable: {
          name: "string",
          type: "inline",
          value: {
            type: "string",
          },
        },
      },
    },
  });

  const rands = [crypto.randomUUID(), crypto.randomUUID()];
  let calls = 0;

  const genId = spy((_: Schemeable) => rands[calls++]);
  const [definitions, ref] = schemeableToJSONSchema(genId, {}, transformed);
  assertEquals(ref.$ref, `#/definitions/${rands[0]}`);
  assertEquals(definitions[rands[0]], {
    allOf: undefined,
    title: "SimpleInterface",
    type: "object",
    properties: {
      name: {
        $ref: `#/definitions/${rands[1]}`,
        title: "Name",
      },
    },
    required: ["name"],
  });

  assertSpyCall(genId, 0, {
    args: [transformed],
    returned: rands[0],
  });
  assertSpyCall(genId, 1, {
    args: [{ type: "inline", value: { type: "string" }, name: "string" }],
    returned: rands[1],
  });

  assertSpyCalls(genId, 2);
});

Deno.test("Non required fields generation", async () => {
  const transformed = await getSchemeableFor("NonRequiredFields");
  if (!transformed) {
    fail("NonRequiredFields should exists");
  }
  assertEquals(transformed, {
    extends: [],
    file: filePath,
    jsDocSchema: {},
    name: "NonRequiredFields",
    type: "object",
    value: {
      name: {
        required: true,
        jsDocSchema: {},
        title: "Name",
        schemeable: {
          type: "inline",
          name: "string",
          value: { type: "string" },
        },
      },
      maybeName: {
        required: false,
        jsDocSchema: {},
        title: "Maybe Name",
        schemeable: {
          type: "inline",
          name: "string",
          value: { type: ["string", "null"] },
        },
      },
    },
  });

  const rands: [string, string, undefined] = [
    crypto.randomUUID(),
    crypto.randomUUID(),
    undefined,
  ];
  let calls = 0;

  const genId = spy((_: Schemeable) => rands[calls++]);
  const [definitions, ref] = schemeableToJSONSchema(genId, {}, transformed);
  assertEquals(ref.$ref, `#/definitions/${rands[0]}`);
  assertEquals(definitions[rands[0]], {
    allOf: undefined,
    type: "object",
    title: "NonRequiredFields",
    properties: {
      maybeName: {
        title: "Maybe Name",
        type: ["string", "null"],
      },
      name: {
        $ref: `#/definitions/${rands[1]}`,
        title: "Name",
      },
    },
    required: ["name"],
  });

  assertSpyCall(genId, 0, {
    args: [transformed],
    returned: rands[0],
  });
  assertSpyCall(genId, 1, {
    args: [{ type: "inline", value: { type: "string" }, name: "string" }],
    returned: rands[1],
  });

  assertSpyCall(genId, 2, {
    args: [{
      type: "inline",
      value: { type: ["string", "null"] },
      name: "string",
    }],
    returned: rands[2],
  });

  assertSpyCalls(genId, 3);
});

Deno.test("Union types generation", async () => {
  const transformed = await getSchemeableFor("UnionTypes");
  if (!transformed) {
    fail("UnionTypes should exists");
  }

  assertEquals(transformed, {
    extends: [],
    file: filePath,
    jsDocSchema: {},
    name: "UnionTypes",
    type: "object",
    value: {
      name: {
        jsDocSchema: {},
        title: "Name",
        required: true,
        schemeable: {
          file: path,
          name: "string|number",
          value: [
            { type: "inline", value: { type: "string" }, name: "string" },
            { type: "inline", value: { type: "number" }, name: "number" },
          ],
          type: "union",
        },
      },
    },
  });

  const rands = [crypto.randomUUID(), crypto.randomUUID()];
  let calls = 0;

  const genId = spy((_: Schemeable) => rands[calls++]);
  const [definitions, ref] = schemeableToJSONSchema(genId, {}, transformed);
  assertEquals(ref.$ref, `#/definitions/${rands[0]}`);
  assertEquals(definitions[rands[0]], {
    allOf: undefined,
    title: "UnionTypes",
    type: "object",
    properties: {
      name: {
        $ref: `#/definitions/${rands[1]}`,
        title: "Name",
      },
    },
    required: ["name"],
  });

  assertSpyCall(genId, 0, {
    args: [transformed],
    returned: rands[0],
  });
  assertSpyCall(genId, 1, {
    args: [
      {
        file: path,
        name: "string|number",
        type: "union",
        value: [
          { type: "inline", value: { type: "string" }, name: "string" },
          { type: "inline", value: { type: "number" }, name: "number" },
        ],
      },
    ],
    returned: rands[1],
  });

  assertSpyCalls(genId, 4);
});

Deno.test("Array fields generation", async () => {
  const transformed = await getSchemeableFor("ArrayFields");
  if (!transformed) {
    fail("ArrayFields should exists");
  }
  assertEquals(transformed, {
    extends: [],
    file: filePath,
    jsDocSchema: {},
    name: "ArrayFields",
    type: "object",
    value: {
      array: {
        required: true,
        jsDocSchema: {},
        title: "Array",
        schemeable: {
          name: "string[]",
          type: "array",
          value: { type: "inline", value: { type: "string" }, name: "string" },
        },
      },
    },
  });

  const rands = [crypto.randomUUID(), crypto.randomUUID()];
  let calls = 0;

  const genId = spy((_: Schemeable) => rands[calls++]);
  const [definitions, ref] = schemeableToJSONSchema(genId, {}, transformed);
  assertEquals(ref.$ref, `#/definitions/${rands[0]}`);
  assertEquals(definitions[rands[0]], {
    allOf: undefined,
    title: "ArrayFields",
    type: "object",
    properties: {
      array: {
        $ref: `#/definitions/${rands[1]}`,
        title: "Array",
      },
    },
    required: ["array"],
  });

  assertSpyCall(genId, 0, {
    args: [transformed],
    returned: rands[0],
  });
  assertSpyCall(genId, 1, {
    args: [
      {
        name: "string[]",
        type: "array",
        value: { type: "inline", value: { type: "string" }, name: "string" },
      },
    ],
    returned: rands[1],
  });

  assertSpyCalls(genId, 3);
});

Deno.test("Type reference generation", async () => {
  const transformed = await getSchemeableFor("InterfaceWithTypeRef");
  if (!transformed) {
    fail("InterfaceWithTypeRef should exists");
  }

  assertEquals(transformed, {
    extends: [],
    file: filePath,
    jsDocSchema: {},
    name: "InterfaceWithTypeRef",
    type: "object",
    value: {
      ref: {
        required: true,
        jsDocSchema: {},
        title: "Ref",
        schemeable: {
          extends: [],
          file: filePath,
          jsDocSchema: {},
          name: "SimpleInterface",
          type: "object",
          value: {
            name: {
              required: true,
              title: "Name",
              jsDocSchema: {},
              schemeable: {
                type: "inline",
                name: "string",
                value: { type: "string" },
              },
            },
          },
        },
      },
    },
  });

  const rands = [crypto.randomUUID(), crypto.randomUUID()];
  let calls = 0;

  const genId = spy((_: Schemeable) => rands[calls++]);
  const [definitions, ref] = schemeableToJSONSchema(genId, {}, transformed);
  assertEquals(ref.$ref, `#/definitions/${rands[0]}`);
  assertEquals(definitions[rands[0]], {
    allOf: undefined,
    title: "InterfaceWithTypeRef",
    type: "object",
    properties: {
      ref: {
        $ref: `#/definitions/${rands[1]}`,
        title: "Ref",
      },
    },
    required: ["ref"],
  });

  assertSpyCall(genId, 0, {
    args: [transformed],
    returned: rands[0],
  });
  assertSpyCall(genId, 1, {
    args: [
      {
        extends: [],
        file: filePath,
        jsDocSchema: {},
        name: "SimpleInterface",
        type: "object",
        value: {
          name: {
            required: true,
            jsDocSchema: {},
            title: "Name",
            schemeable: {
              name: "string",
              type: "inline",
              value: {
                type: "string",
              },
            },
          },
        },
      },
    ],
    returned: rands[1],
  });

  assertSpyCalls(genId, 3);
});

Deno.test("JSDoc tags injection", async () => {
  const transformed = await getSchemeableFor("WithTags");
  if (!transformed) {
    fail("WithTags should exists");
  }
  assertEquals(transformed, {
    type: "object",
    extends: [],
    file: filePath,
    jsDocSchema: {},
    name: "WithTags",
    value: {
      email: {
        required: true,
        jsDocSchema: {
          description: "add your email",
          format: "email",
          title: "Email",
        },
        title: "Email",
        schemeable: {
          name: "string",
          type: "inline",
          value: {
            type: "string",
          },
        },
      },
    },
  });

  const rands = [crypto.randomUUID(), crypto.randomUUID()];
  let calls = 0;

  const genId = spy((_: Schemeable) => rands[calls++]);
  const [definitions, ref] = schemeableToJSONSchema(genId, {}, transformed);
  assertEquals(ref.$ref, `#/definitions/${rands[0]}`);
  assertEquals(definitions[rands[0]], {
    allOf: undefined,
    title: "WithTags",
    type: "object",
    properties: {
      email: {
        $ref: `#/definitions/${rands[1]}`,
        description: "add your email",
        format: "email",
        title: "Email",
      },
    },
    required: ["email"],
  });

  assertSpyCall(genId, 0, {
    args: [transformed],
    returned: rands[0],
  });
  assertSpyCall(genId, 1, {
    args: [
      {
        name: "string",
        type: "inline",
        value: { type: "string" },
      },
    ],
    returned: rands[1],
  });

  assertSpyCalls(genId, 2);
});

Deno.test("Type alias generation", async () => {
  const transformed = await getSchemeableFor("TypeAlias");
  if (!transformed) {
    fail("TypeAlias should exists");
  }
  assertEquals(transformed, {
    file: filePath,
    jsDocSchema: {},
    name: "TypeAlias",
    type: "inline",
    value: { type: "string" },
  });

  const rands = [crypto.randomUUID(), crypto.randomUUID()];
  let calls = 0;

  const genId = spy((_: Schemeable) => rands[calls++]);
  const [definitions, ref] = schemeableToJSONSchema(genId, {}, transformed);
  assertEquals(ref.$ref, `#/definitions/${rands[0]}`);
  assertEquals(definitions[rands[0]], {
    title: "TypeAlias",
    type: "string",
  });

  assertSpyCall(genId, 0, {
    args: [transformed],
    returned: rands[0],
  });

  assertSpyCalls(genId, 1);
});

Deno.test("Wellknown in types generation", async () => {
  const transformed = await getSchemeableFor("WellKnown");
  if (!transformed) {
    fail("WellKnown should exists");
  }

  assertEquals(transformed, {
    name: "WellKnown",
    file: filePath,
    jsDocSchema: {},
    extends: [],
    type: "object",
    value: {
      array: {
        required: true,
        jsDocSchema: {},
        schemeable: {
          name: "string[]",
          type: "array",
          value: { type: "inline", value: { type: "string" }, name: "string" },
        },
        title: "Array",
      },
      record: {
        required: true,
        jsDocSchema: {},
        schemeable: {
          name: "record<string>",
          type: "record",
          value: { type: "inline", value: { type: "string" }, name: "string" },
        },
        title: "Record",
      },
      section: {
        required: true,
        jsDocSchema: {},
        schemeable: {
          type: "inline",
          value: { $ref: "#/root/sections" },
          name: "IF@Iy9yb290L3NlY3Rpb25z",
        },
        title: "Section",
      },
      promiseValue: {
        required: true,
        jsDocSchema: {},
        schemeable: {
          type: "inline",
          value: { type: "string" },
          name: "string",
        },
        title: "Promise Value",
      },
      resolvable: {
        required: true,
        jsDocSchema: {},
        schemeable: {
          type: "inline",
          name: "Resolvable",
          value: { $ref: "#/definitions/Resolvable" },
        },
        title: "Resolvable",
      },
      preactComponent: {
        required: true,
        jsDocSchema: {},
        schemeable: {
          type: "inline",
          value: { $ref: "#/root/sections" },
          name: "IF@Iy9yb290L3NlY3Rpb25z",
        },
        title: "Preact Component",
      },
    },
  });

  const rands = [crypto.randomUUID(), crypto.randomUUID()];
  let calls = 0;

  const genId = spy((_: Schemeable) => rands[calls++]);
  const [definitions, ref] = schemeableToJSONSchema(genId, {}, transformed);
  assertEquals(ref.$ref, `#/definitions/${rands[0]}`);
  assertEquals(definitions[rands[0]], {
    allOf: undefined,
    title: "WellKnown",
    type: "object",
    properties: {
      array: {
        $ref: `#/definitions/${rands[1]}`,
        title: "Array",
      },
      preactComponent: {
        $ref: "#/root/sections",
        title: "Preact Component",
      },
      promiseValue: {
        title: "Promise Value",
        type: "string",
      },
      record: {
        title: "Record",
        type: "object",
        additionalProperties: {
          type: "string",
        },
      },
      resolvable: {
        $ref: "#/definitions/Resolvable",
        title: "Resolvable",
      },
      section: {
        $ref: "#/root/sections",
        title: "Section",
      },
    },
    required: [
      "array",
      "record",
      "section",
      "promiseValue",
      "resolvable",
      "preactComponent",
    ],
  });

  assertSpyCall(genId, 0, {
    args: [transformed],
    returned: rands[0],
  });

  assertSpyCalls(genId, 9);
});
