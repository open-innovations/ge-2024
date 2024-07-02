import parties from "./parties.ts";

export const names = Object.entries(parties).reduce(
  (res, [key, value]) => ({ ...res, [key]: value.colour }),
  {},
);
