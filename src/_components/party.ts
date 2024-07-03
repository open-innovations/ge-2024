import { Colour } from "oi_lume_viz/lib/colour/colour.ts";

export default function ({ party, name, parties, tag }: Lume.Data) {
  const key = Object.keys(parties).includes(party) ? party : "other";
  const c = Colour(parties[party].colour);
  return `<${
    tag || "span"
  } style="color:${c.contrast};background:${c.hex};padding:0.2em 0.5em;">${
    name || parties[key]?.name
  }</${tag || "span"}>`;
}
