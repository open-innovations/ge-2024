import { Colour } from "https://deno.land/x/oi_lume_viz@v0.15.6/lib/colour/colour.ts";

export default function (
  { winner, previous, results, parties, thumbnails }: Lume.Data,
) {
  const html = "";
  const party = winner.party_key;
  const pts = Object.keys(parties);
  const key = pts.includes(party) ? party : "other";
  const c = Colour(key);
  let bg = c.hex;
  let src = "/assets/images/missing.svg";
  let maj;

  if (typeof thumbnails === "undefined") thumbnails = {};

  if (typeof thumbnails[winner.person_id] === "string") {
    src = thumbnails[winner.person_id]; // r.image
  }

  if (results.votes.length > 0) {
    maj = results.votes[0].votes - results.votes[1].votes;
  }

  if (previous != party) {
    const c2 = Colour(previous);
    //bg = 'linear-gradient(90deg, transparent 0%, transparent calc(96% - 0.25em), white calc(96% - 0.25em), white 96%, ' + c2.hex + ' 96%, ' + c2.hex + ' 100%), '+c.hex;
    bg = "linear-gradient(110deg, " + c.hex + " 0%, " + c.hex +
      " calc(100% - 2em), white calc(100% - 2em), white calc(100% - 1.75em), " +
      c2.hex + " calc(100% - 1.75em)), linear-gradient(70deg, " + c.hex +
      " 0%, " + c.hex +
      " calc(100% - 2em), white calc(100% - 2em), white calc(100% - 1.75em), " +
      c2.hex +
      " calc(100% - 1.75em));background-size: 100% 50%;background-repeat: no-repeat;background-position: top left, bottom left;";
  }
  html += '<div class="winner" style="background:' + bg + ";color:" +
    c.contrast + ';">';
  html += '<div class="image"><img src="' + src + '" /></div>';
  html += '<div class="about">';
  html += '<span class="headline">' + winner.party_name +
    (previous == party ? " HOLD" : " GAIN") + "</span>";
  html += "<br />Elected: <strong>" + winner.person_name + "</strong>";
  html += "<br />Majority: <strong>" + maj.toLocaleString() + "</strong>";
  html += "</div>";
  html += "</div>";
  return html;
}
