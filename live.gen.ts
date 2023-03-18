// DO NOT EDIT. This file is generated by deco.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import config from "./deno.json" assert { type: "json" };
import { DecoManifest } from "$live/types.ts";
import { context } from "$live/live.ts";

import * as $$$0 from "./routes/[...catchall].tsx";
import * as $$$$$0 from "$live/handlers/routesSelection.ts";
import * as $$$$$1 from "$live/handlers/router.ts";
import * as $$$$$2 from "$live/handlers/fresh.ts";
import * as $$$$$$0 from "$live/pages/LivePage.tsx";
import * as $$$$$$$$0 from "$live/matchers/MatchDate.ts";
import * as $$$$$$$$1 from "$live/matchers/MatchUserAgent.ts";
import * as $$$$$$$$2 from "$live/matchers/MatchSite.ts";
import * as $$$$$$$$3 from "$live/matchers/MatchMulti.ts";
import * as $$$$$$$$4 from "$live/matchers/MatchRandom.ts";
import * as $$$$$$$$5 from "$live/matchers/MatchEnvironment.ts";
import * as $$$$$$$$6 from "$live/matchers/MatchAlways.ts";
import * as $$$$$$$$$0 from "$live/flags/audience.ts";
import * as $$$$$$$$$1 from "$live/flags/everyone.ts";
import { configurable } from "$live/engine/fresh/manifest.ts";
import * as $live_schema from "$live/routes/live/schema.ts";
import * as $live_previews from "$live/routes/live/previews/[...block].tsx";

const manifest: DecoManifest = {
  "routes": {
    "./routes/[...catchall].tsx": $$$0,
    "./routes/live/schema.ts": $live_schema,
    "./routes/live/previews/[...block].tsx": $live_previews,
  },
  "handlers": {
    "$live/handlers/routesSelection.ts": $$$$$0,
    "$live/handlers/router.ts": $$$$$1,
    "$live/handlers/fresh.ts": $$$$$2,
  },
  "pages": {
    "$live/pages/LivePage.tsx": $$$$$$0,
  },
  "matchers": {
    "$live/matchers/MatchDate.ts": $$$$$$$$0,
    "$live/matchers/MatchUserAgent.ts": $$$$$$$$1,
    "$live/matchers/MatchSite.ts": $$$$$$$$2,
    "$live/matchers/MatchMulti.ts": $$$$$$$$3,
    "$live/matchers/MatchRandom.ts": $$$$$$$$4,
    "$live/matchers/MatchEnvironment.ts": $$$$$$$$5,
    "$live/matchers/MatchAlways.ts": $$$$$$$$6,
  },
  "flags": {
    "$live/flags/audience.ts": $$$$$$$$$0,
    "$live/flags/everyone.ts": $$$$$$$$$1,
  },
  "islands": {},
  "config": config,
  "baseUrl": import.meta.url,
  "schemas": {
    "definitions": {
      "JGxpdmUvYmxvY2tzL2ZsYWcudHM=@Flag": {
        "$ref": "#/root/flags",
        "$id": "JGxpdmUvYmxvY2tzL2ZsYWcudHM=@Flag",
      },
      "JGxpdmUvYmxvY2tzL2ZsYWcudHM=@Flag[]": {
        "type": "array",
        "items": { "$ref": "#/definitions/JGxpdmUvYmxvY2tzL2ZsYWcudHM=@Flag" },
        "$id": "JGxpdmUvYmxvY2tzL2ZsYWcudHM=@Flag[]",
      },
      "JGxpdmUvaGFuZGxlcnMvcm91dGVzU2VsZWN0aW9uLnRz@SelectionConfig": {
        "type": "object",
        "allOf": [],
        "properties": {
          "flags": {
            "title": "Flags",
            "$ref": "#/definitions/JGxpdmUvYmxvY2tzL2ZsYWcudHM=@Flag[]",
          },
        },
        "required": ["flags"],
        "title": "$live/handlers/routesSelection.ts@SelectionConfig",
        "$id": "$live/handlers/routesSelection.ts@SelectionConfig",
      },
      "JGxpdmUvYmxvY2tzL2hhbmRsZXIudHM=@Handler": {
        "$ref": "#/root/handlers",
        "$id": "JGxpdmUvYmxvY2tzL2hhbmRsZXIudHM=@Handler",
      },
      "c1e8bfc3-4d3d-456a-b3e8-aea7d37f9cb4@Handler@record": {
        "title": "Unknown record",
        "type": "object",
        "additionalProperties": {
          "$ref": "#/definitions/JGxpdmUvYmxvY2tzL2hhbmRsZXIudHM=@Handler",
        },
        "$id": "c1e8bfc3-4d3d-456a-b3e8-aea7d37f9cb4@Handler@record",
      },
      "JGxpdmUvaGFuZGxlcnMvcm91dGVyLnRz@RouterConfig": {
        "type": "object",
        "allOf": [],
        "properties": {
          "base": { "title": "Base", "type": ["string", "null"] },
          "routes": {
            "title": "Routes",
            "$ref":
              "#/definitions/c1e8bfc3-4d3d-456a-b3e8-aea7d37f9cb4@Handler@record",
          },
        },
        "required": ["routes"],
        "title": "$live/handlers/router.ts@RouterConfig",
        "$id": "$live/handlers/router.ts@RouterConfig",
      },
      "JGxpdmUvYmxvY2tzL3BhZ2UudHM=@Page": {
        "$ref": "#/root/pages",
        "$id": "JGxpdmUvYmxvY2tzL3BhZ2UudHM=@Page",
      },
      "JGxpdmUvaGFuZGxlcnMvZnJlc2gudHM=@FreshConfig": {
        "type": "object",
        "allOf": [],
        "properties": {
          "page": {
            "title": "Page",
            "$ref": "#/definitions/JGxpdmUvYmxvY2tzL3BhZ2UudHM=@Page",
          },
        },
        "required": ["page"],
        "title": "$live/handlers/fresh.ts@FreshConfig",
        "$id": "$live/handlers/fresh.ts@FreshConfig",
      },
      "JGxpdmUvYmxvY2tzL3NlY3Rpb24udHM=@Section": {
        "$ref": "#/root/sections",
        "$id": "JGxpdmUvYmxvY2tzL3NlY3Rpb24udHM=@Section",
      },
      "JGxpdmUvYmxvY2tzL3NlY3Rpb24udHM=@Section[]": {
        "type": "array",
        "items": {
          "$ref": "#/definitions/JGxpdmUvYmxvY2tzL3NlY3Rpb24udHM=@Section",
        },
        "$id": "JGxpdmUvYmxvY2tzL3NlY3Rpb24udHM=@Section[]",
      },
      "JGxpdmUvZW5naW5lL2Jsb2NrLnRz@ComponentMetadata": {
        "type": "object",
        "allOf": [],
        "properties": {
          "resolveChain": {
            "title": "Resolve Chain",
            "type": "array",
            "items": { "type": "string" },
          },
          "resolver": { "title": "Resolver", "type": "string" },
        },
        "required": ["resolveChain", "resolver"],
        "title": "JGxpdmUvZW5naW5lL2Jsb2NrLnRz@ComponentMetadata",
        "$id": "JGxpdmUvZW5naW5lL2Jsb2NrLnRz@ComponentMetadata",
      },
      "JGxpdmUvcGFnZXMvTGl2ZVBhZ2UudHN4@Props": {
        "type": "object",
        "allOf": [],
        "properties": {
          "sections": {
            "title": "Sections",
            "$ref": "#/definitions/JGxpdmUvYmxvY2tzL3NlY3Rpb24udHM=@Section[]",
          },
          "__metadata": {
            "title": "__metadata",
            "$ref":
              "#/definitions/JGxpdmUvZW5naW5lL2Jsb2NrLnRz@ComponentMetadata",
          },
        },
        "required": ["sections", "__metadata"],
        "title": "$live/pages/LivePage.tsx@Props",
        "$id": "$live/pages/LivePage.tsx@Props",
      },
      "JGxpdmUvbWF0Y2hlcnMvTWF0Y2hEYXRlLnRz@Props": {
        "type": "object",
        "allOf": [],
        "properties": {
          "start": {
            "title": "Start",
            "type": ["string", "null"],
            "format": "date-time",
          },
          "end": {
            "title": "End",
            "type": ["string", "null"],
            "format": "date-time",
          },
        },
        "required": [],
        "title": "$live/matchers/MatchDate.ts@Props",
        "$id": "$live/matchers/MatchDate.ts@Props",
      },
      "JGxpdmUvbWF0Y2hlcnMvTWF0Y2hVc2VyQWdlbnQudHM=@Props": {
        "type": "object",
        "allOf": [],
        "properties": {
          "includes": { "title": "Includes", "type": ["string", "null"] },
          "match": { "title": "Match", "type": ["string", "null"] },
        },
        "required": [],
        "title": "$live/matchers/MatchUserAgent.ts@Props",
        "$id": "$live/matchers/MatchUserAgent.ts@Props",
      },
      "JGxpdmUvbWF0Y2hlcnMvTWF0Y2hTaXRlLnRz@Props": {
        "type": "object",
        "allOf": [],
        "properties": { "siteId": { "title": "Site Id", "type": "number" } },
        "required": ["siteId"],
        "title": "$live/matchers/MatchSite.ts@Props",
        "$id": "$live/matchers/MatchSite.ts@Props",
      },
      "JGxpdmUvYmxvY2tzL21hdGNoZXIudHM=@Matcher": {
        "$ref": "#/root/matchers",
        "$id": "JGxpdmUvYmxvY2tzL21hdGNoZXIudHM=@Matcher",
      },
      "JGxpdmUvYmxvY2tzL21hdGNoZXIudHM=@Matcher[]": {
        "type": "array",
        "items": {
          "$ref": "#/definitions/JGxpdmUvYmxvY2tzL21hdGNoZXIudHM=@Matcher",
        },
        "$id": "JGxpdmUvYmxvY2tzL21hdGNoZXIudHM=@Matcher[]",
      },
      "JGxpdmUvbWF0Y2hlcnMvTWF0Y2hNdWx0aS50cw==@Props": {
        "type": "object",
        "allOf": [],
        "properties": {
          "op": {
            "title": "Op",
            "anyOf": [{ "type": "string", "const": "or" }, {
              "type": "string",
              "const": "and",
            }],
          },
          "matchers": {
            "title": "Matchers",
            "$ref": "#/definitions/JGxpdmUvYmxvY2tzL21hdGNoZXIudHM=@Matcher[]",
          },
        },
        "required": ["op", "matchers"],
        "title": "$live/matchers/MatchMulti.ts@Props",
        "$id": "$live/matchers/MatchMulti.ts@Props",
      },
      "JGxpdmUvbWF0Y2hlcnMvTWF0Y2hSYW5kb20udHM=@Props": {
        "type": "object",
        "allOf": [],
        "properties": { "traffic": { "title": "Traffic", "type": "number" } },
        "required": ["traffic"],
        "title": "$live/matchers/MatchRandom.ts@Props",
        "$id": "$live/matchers/MatchRandom.ts@Props",
      },
      "JGxpdmUvbWF0Y2hlcnMvTWF0Y2hFbnZpcm9ubWVudC50cw==@Props": {
        "type": "object",
        "allOf": [],
        "properties": {
          "environment": {
            "title": "Environment",
            "anyOf": [{ "type": "string", "const": "production" }, {
              "type": "string",
              "const": "development",
            }],
          },
        },
        "required": ["environment"],
        "title": "$live/matchers/MatchEnvironment.ts@Props",
        "$id": "$live/matchers/MatchEnvironment.ts@Props",
      },
      "61f5f54d-5724-4b07-a34a-b2e5279236fa@Handler@record": {
        "title": "Unknown record",
        "type": "object",
        "additionalProperties": {
          "$ref": "#/definitions/JGxpdmUvYmxvY2tzL2hhbmRsZXIudHM=@Handler",
        },
        "$id": "61f5f54d-5724-4b07-a34a-b2e5279236fa@Handler@record",
      },
      "JGxpdmUvZmxhZ3MvYXVkaWVuY2UudHM=@Audience": {
        "type": "object",
        "allOf": [],
        "properties": {
          "matcher": {
            "title": "Matcher",
            "$ref": "#/definitions/JGxpdmUvYmxvY2tzL21hdGNoZXIudHM=@Matcher",
          },
          "name": { "title": "Name", "type": "string" },
          "routes": {
            "title": "Routes",
            "$ref":
              "#/definitions/61f5f54d-5724-4b07-a34a-b2e5279236fa@Handler@record",
          },
          "overrides": {
            "title": "Unknown record",
            "type": "object",
            "additionalProperties": { "type": "string" },
          },
        },
        "required": ["matcher", "name", "routes"],
        "title": "$live/flags/audience.ts@Audience",
        "$id": "$live/flags/audience.ts@Audience",
      },
      "f2433285-d7f1-4cae-b5a3-6aa9d8b71ca4@Handler@record": {
        "title": "Unknown record",
        "type": "object",
        "additionalProperties": {
          "$ref": "#/definitions/JGxpdmUvYmxvY2tzL2hhbmRsZXIudHM=@Handler",
        },
        "$id": "f2433285-d7f1-4cae-b5a3-6aa9d8b71ca4@Handler@record",
      },
      "JGxpdmUvZmxhZ3MvZXZlcnlvbmUudHM=@EveryoneConfig": {
        "type": "object",
        "allOf": [],
        "properties": {
          "routes": {
            "title": "Routes",
            "$ref":
              "#/definitions/f2433285-d7f1-4cae-b5a3-6aa9d8b71ca4@Handler@record",
          },
          "overrides": {
            "title": "Unknown record",
            "type": "object",
            "additionalProperties": { "type": "string" },
          },
        },
        "required": [],
        "title": "$live/flags/everyone.ts@EveryoneConfig",
        "$id": "$live/flags/everyone.ts@EveryoneConfig",
      },
      "JGxpdmUvaGFuZGxlcnMvcm91dGVzU2VsZWN0aW9uLnRz": {
        "title": "$live/handlers/routesSelection.ts",
        "type": "object",
        "allOf": [{
          "$ref":
            "#/definitions/JGxpdmUvaGFuZGxlcnMvcm91dGVzU2VsZWN0aW9uLnRz@SelectionConfig",
        }],
        "required": ["__resolveType"],
        "properties": {
          "__resolveType": {
            "type": "string",
            "default": "$live/handlers/routesSelection.ts",
          },
        },
        "$id": "$live/handlers/routesSelection.ts",
      },
      "JGxpdmUvaGFuZGxlcnMvcm91dGVyLnRz": {
        "title": "$live/handlers/router.ts",
        "type": "object",
        "allOf": [{
          "$ref": "#/definitions/JGxpdmUvaGFuZGxlcnMvcm91dGVyLnRz@RouterConfig",
        }],
        "required": ["__resolveType"],
        "properties": {
          "__resolveType": {
            "type": "string",
            "default": "$live/handlers/router.ts",
          },
        },
        "$id": "$live/handlers/router.ts",
      },
      "JGxpdmUvaGFuZGxlcnMvZnJlc2gudHM=": {
        "title": "$live/handlers/fresh.ts",
        "type": "object",
        "allOf": [{
          "$ref": "#/definitions/JGxpdmUvaGFuZGxlcnMvZnJlc2gudHM=@FreshConfig",
        }],
        "required": ["__resolveType"],
        "properties": {
          "__resolveType": {
            "type": "string",
            "default": "$live/handlers/fresh.ts",
          },
        },
        "$id": "$live/handlers/fresh.ts",
      },
      "JGxpdmUvcGFnZXMvTGl2ZVBhZ2UudHN4": {
        "title": "$live/pages/LivePage.tsx",
        "type": "object",
        "allOf": [{
          "$ref": "#/definitions/JGxpdmUvcGFnZXMvTGl2ZVBhZ2UudHN4@Props",
        }],
        "required": ["__resolveType"],
        "properties": {
          "__resolveType": {
            "type": "string",
            "default": "$live/pages/LivePage.tsx",
          },
        },
        "$id": "$live/pages/LivePage.tsx",
      },
      "JGxpdmUvbWF0Y2hlcnMvTWF0Y2hEYXRlLnRz": {
        "title": "$live/matchers/MatchDate.ts",
        "type": "object",
        "allOf": [{
          "$ref": "#/definitions/JGxpdmUvbWF0Y2hlcnMvTWF0Y2hEYXRlLnRz@Props",
        }],
        "required": ["__resolveType"],
        "properties": {
          "__resolveType": {
            "type": "string",
            "default": "$live/matchers/MatchDate.ts",
          },
        },
        "$id": "$live/matchers/MatchDate.ts",
      },
      "JGxpdmUvbWF0Y2hlcnMvTWF0Y2hVc2VyQWdlbnQudHM=": {
        "title": "$live/matchers/MatchUserAgent.ts",
        "type": "object",
        "allOf": [{
          "$ref":
            "#/definitions/JGxpdmUvbWF0Y2hlcnMvTWF0Y2hVc2VyQWdlbnQudHM=@Props",
        }],
        "required": ["__resolveType"],
        "properties": {
          "__resolveType": {
            "type": "string",
            "default": "$live/matchers/MatchUserAgent.ts",
          },
        },
        "$id": "$live/matchers/MatchUserAgent.ts",
      },
      "JGxpdmUvbWF0Y2hlcnMvTWF0Y2hTaXRlLnRz": {
        "title": "$live/matchers/MatchSite.ts",
        "type": "object",
        "allOf": [{
          "$ref": "#/definitions/JGxpdmUvbWF0Y2hlcnMvTWF0Y2hTaXRlLnRz@Props",
        }],
        "required": ["__resolveType"],
        "properties": {
          "__resolveType": {
            "type": "string",
            "default": "$live/matchers/MatchSite.ts",
          },
        },
        "$id": "$live/matchers/MatchSite.ts",
      },
      "JGxpdmUvbWF0Y2hlcnMvTWF0Y2hNdWx0aS50cw==": {
        "title": "$live/matchers/MatchMulti.ts",
        "type": "object",
        "allOf": [{
          "$ref":
            "#/definitions/JGxpdmUvbWF0Y2hlcnMvTWF0Y2hNdWx0aS50cw==@Props",
        }],
        "required": ["__resolveType"],
        "properties": {
          "__resolveType": {
            "type": "string",
            "default": "$live/matchers/MatchMulti.ts",
          },
        },
        "$id": "$live/matchers/MatchMulti.ts",
      },
      "JGxpdmUvbWF0Y2hlcnMvTWF0Y2hSYW5kb20udHM=": {
        "title": "$live/matchers/MatchRandom.ts",
        "type": "object",
        "allOf": [{
          "$ref":
            "#/definitions/JGxpdmUvbWF0Y2hlcnMvTWF0Y2hSYW5kb20udHM=@Props",
        }],
        "required": ["__resolveType"],
        "properties": {
          "__resolveType": {
            "type": "string",
            "default": "$live/matchers/MatchRandom.ts",
          },
        },
        "$id": "$live/matchers/MatchRandom.ts",
      },
      "JGxpdmUvbWF0Y2hlcnMvTWF0Y2hFbnZpcm9ubWVudC50cw==": {
        "title": "$live/matchers/MatchEnvironment.ts",
        "type": "object",
        "allOf": [{
          "$ref":
            "#/definitions/JGxpdmUvbWF0Y2hlcnMvTWF0Y2hFbnZpcm9ubWVudC50cw==@Props",
        }],
        "required": ["__resolveType"],
        "properties": {
          "__resolveType": {
            "type": "string",
            "default": "$live/matchers/MatchEnvironment.ts",
          },
        },
        "$id": "$live/matchers/MatchEnvironment.ts",
      },
      "JGxpdmUvbWF0Y2hlcnMvTWF0Y2hBbHdheXMudHM=": {
        "title": "$live/matchers/MatchAlways.ts",
        "type": "object",
        "allOf": [],
        "required": ["__resolveType"],
        "properties": {
          "__resolveType": {
            "type": "string",
            "default": "$live/matchers/MatchAlways.ts",
          },
        },
        "$id": "$live/matchers/MatchAlways.ts",
      },
      "JGxpdmUvZmxhZ3MvYXVkaWVuY2UudHM=": {
        "title": "$live/flags/audience.ts",
        "type": "object",
        "allOf": [{
          "$ref": "#/definitions/JGxpdmUvZmxhZ3MvYXVkaWVuY2UudHM=@Audience",
        }],
        "required": ["__resolveType"],
        "properties": {
          "__resolveType": {
            "type": "string",
            "default": "$live/flags/audience.ts",
          },
        },
        "$id": "$live/flags/audience.ts",
      },
      "JGxpdmUvZmxhZ3MvZXZlcnlvbmUudHM=": {
        "title": "$live/flags/everyone.ts",
        "type": "object",
        "allOf": [{
          "$ref":
            "#/definitions/JGxpdmUvZmxhZ3MvZXZlcnlvbmUudHM=@EveryoneConfig",
        }],
        "required": ["__resolveType"],
        "properties": {
          "__resolveType": {
            "type": "string",
            "default": "$live/flags/everyone.ts",
          },
        },
        "$id": "$live/flags/everyone.ts",
      },
      "JGxpdmUvcm91dGVzL1suLi5jYXRjaGFsbF0udHN4@Entrypoint": {
        "type": "object",
        "allOf": [],
        "properties": {
          "handler": {
            "title": "Handler",
            "$ref": "#/definitions/JGxpdmUvYmxvY2tzL2hhbmRsZXIudHM=@Handler",
          },
        },
        "required": ["handler"],
        "title": "$live/routes/[...catchall].tsx@Entrypoint",
        "$id": "$live/routes/[...catchall].tsx@Entrypoint",
      },
    },
    "root": {
      "handlers": {
        "title": "handlers",
        "anyOf": [
          {
            "$ref":
              "#/definitions/JGxpdmUvaGFuZGxlcnMvcm91dGVzU2VsZWN0aW9uLnRz",
          },
          { "$ref": "#/definitions/JGxpdmUvaGFuZGxlcnMvcm91dGVyLnRz" },
          { "$ref": "#/definitions/JGxpdmUvaGFuZGxlcnMvZnJlc2gudHM=" },
        ],
      },
      "pages": {
        "title": "pages",
        "anyOf": [{ "$ref": "#/definitions/JGxpdmUvcGFnZXMvTGl2ZVBhZ2UudHN4" }],
      },
      "matchers": {
        "title": "matchers",
        "anyOf": [
          { "$ref": "#/definitions/JGxpdmUvbWF0Y2hlcnMvTWF0Y2hEYXRlLnRz" },
          {
            "$ref":
              "#/definitions/JGxpdmUvbWF0Y2hlcnMvTWF0Y2hVc2VyQWdlbnQudHM=",
          },
          { "$ref": "#/definitions/JGxpdmUvbWF0Y2hlcnMvTWF0Y2hTaXRlLnRz" },
          { "$ref": "#/definitions/JGxpdmUvbWF0Y2hlcnMvTWF0Y2hNdWx0aS50cw==" },
          { "$ref": "#/definitions/JGxpdmUvbWF0Y2hlcnMvTWF0Y2hSYW5kb20udHM=" },
          {
            "$ref":
              "#/definitions/JGxpdmUvbWF0Y2hlcnMvTWF0Y2hFbnZpcm9ubWVudC50cw==",
          },
          { "$ref": "#/definitions/JGxpdmUvbWF0Y2hlcnMvTWF0Y2hBbHdheXMudHM=" },
        ],
      },
      "flags": {
        "title": "flags",
        "anyOf": [
          { "$ref": "#/definitions/JGxpdmUvZmxhZ3MvYXVkaWVuY2UudHM=" },
          { "$ref": "#/definitions/JGxpdmUvZmxhZ3MvZXZlcnlvbmUudHM=" },
        ],
      },
      "state": {
        "type": "object",
        "required": ["./routes/[...catchall].tsx"],
        "properties": {
          "./routes/[...catchall].tsx": {
            "$ref":
              "#/definitions/JGxpdmUvcm91dGVzL1suLi5jYXRjaGFsbF0udHN4@Entrypoint",
          },
        },
        "additionalProperties": {
          "anyOf": [{ "$ref": "#/root/handlers" }, { "$ref": "#/root/pages" }, {
            "$ref": "#/root/matchers",
          }, { "$ref": "#/root/flags" }],
        },
      },
    },
  },
};

context.namespace = "$live";

export default configurable(manifest);
