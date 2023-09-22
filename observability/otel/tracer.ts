import { registerInstrumentations } from "npm:@opentelemetry/instrumentation";
import { FetchInstrumentation } from "npm:@opentelemetry/instrumentation-fetch";

import { OTLPTraceExporter } from "npm:@opentelemetry/exporter-trace-otlp-proto";
import { Resource } from "npm:@opentelemetry/resources";
import {
  BatchSpanProcessor,
  ParentBasedSampler,
  TraceIdRatioBasedSampler,
} from "npm:@opentelemetry/sdk-trace-base";
import { NodeTracerProvider } from "npm:@opentelemetry/sdk-trace-node";
import {
  SemanticResourceAttributes,
} from "npm:@opentelemetry/semantic-conventions";

import opentelemetry from "npm:@opentelemetry/api";
import { context } from "../../live.ts";
import meta from "../../meta.json" assert { type: "json" };
import { DebugSampler } from "./samplers/debug.ts";

registerInstrumentations({
  instrumentations: [new FetchInstrumentation()],
});

// Monkeypatching to get past FetchInstrumentation's dependence on sdk-trace-web, which has runtime dependencies on some browser-only constructs. See https://github.com/open-telemetry/opentelemetry-js/issues/3413#issuecomment-1496834689 for more details
// Specifically for this line - https://github.com/open-telemetry/opentelemetry-js/blob/main/packages/opentelemetry-sdk-trace-web/src/utils.ts#L310
// @ts-ignore: monkey patching location
globalThis.location = {};

const resource = Resource.default().merge(
  new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "deco",
    [SemanticResourceAttributes.SERVICE_VERSION]: context.deploymentId ??
      Deno.hostname(),
    "deco.runtime.version": meta.version,
  }),
);

const OTEL_TRACING_RATIO_ENV_VAR = "OTEL_SAMPLING_RATIO";
const tracingSampleRatio = Deno.env.has(OTEL_TRACING_RATIO_ENV_VAR)
  ? +Deno.env.get(OTEL_TRACING_RATIO_ENV_VAR)!
  : 0;

const provider = new NodeTracerProvider({
  resource: resource,
  sampler: new ParentBasedSampler(
    {
      root: new TraceIdRatioBasedSampler(tracingSampleRatio),
      localParentNotSampled: new DebugSampler(),
    },
  ),
});
provider.resource.waitForAsyncAttributes;

const traceExporter = new OTLPTraceExporter();
provider.addSpanProcessor(new BatchSpanProcessor(traceExporter));

provider.register();

export const tracer = opentelemetry.trace.getTracer(
  "deco-tracer",
);
