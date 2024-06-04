import {
    getProbeThresholdAsNum,
    type LiveChecker,
    type Metrics,
} from "./handler.ts";

const NAME = "MAX_REQUEST_COUNT";
const MAX_REQ_THRESHOLD = getProbeThresholdAsNum(NAME);

export const reqCountChecker: LiveChecker = {
  name: NAME,
  checker: ({ requests: { count } }: Metrics) => {
    if (!MAX_REQ_THRESHOLD) {
      return true;
    }
    return count < MAX_REQ_THRESHOLD;
  },
};
