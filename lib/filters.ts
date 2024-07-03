import { ConstituencyPage } from "../types.ts";

export const extractResults = (r: ConstituencyPage[]) =>
  r.map((c) => ({
    pcon24cd: c.pcon24cd,
    winner: c.winner?.party_key || "",
    winner_name: c.winner?.party_name || "Awaiting result",
  }));
