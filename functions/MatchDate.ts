import { MatchFunction } from "$live/std/types.ts";

export interface Props {
  start?: number;
  end?: number;
  session: boolean;
}

const MatchDate: MatchFunction<Props> = (
  _,
  __,
  props,
) => {
  const now = new Date();
  const start = props.start ? now > new Date(props.start) : true;
  const end = props.end ? now < new Date(props.end) : true;
  const duration = props.session ? "session" : "request";
  return { isMatch: start && end, duration };
};

export default MatchDate;
