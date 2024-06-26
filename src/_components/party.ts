import { Colour } from "https://deno.land/x/oi_lume_viz@v0.15.6/lib/colour/colour.ts";

export default function ({ party, parties }: Lume.Data) {
  const key = Object.keys(parties).includes(party) ? party : "other";
  const c = Colour(key);
  return `<span style="color:${c.contrast};background:${c.hex};padding:0.2em 0.5em;">${
    parties[key]?.name
  }</span>`;
}
