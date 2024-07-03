import { Colour } from "oi_lume_viz/lib/colour/colour.ts";

export default function ({ colour }: Lume.Page & { colour: string }) {
  return Colour(colour);
}
