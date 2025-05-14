import { DOMParser } from "npm:linkedom@0.18.10";
import { ConstituencyPage } from "../types.ts";

export const extractResults = (r: ConstituencyPage[]) =>
  r.map((c) => ({
    pcon24cd: c.pcon24cd,
    winner: c.winner?.party_key || "",
    winner_name: c.winner?.party_name || "Awaiting result",
  }));

export const getSelector = (content: string, selector: string) => {
  const frag = new DOMParser().parseFromString(content, "text/html");
  return frag.querySelector(selector).toString();
};

export const setAttributes = (
  content: string,
  attributes: { [k: string]: unknown },
  type = "image/svg+xml",
) => {
  const frag = new DOMParser().parseFromString(content, type);
  for (const [k, v] of Object.entries(attributes)) {
    frag.children[0].setAttribute(k, v);
  }
  return frag.toString();
};
