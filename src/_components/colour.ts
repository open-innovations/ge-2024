import { Colour } from "https://deno.land/x/oi_lume_viz@v0.15.6/lib/colour/colour.ts";

export default function ({ colour }: Lume.Page) {
  return Colour(colour);
}
