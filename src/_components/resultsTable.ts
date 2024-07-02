import { Colour } from "https://deno.land/x/oi_lume_viz@v0.15.7/lib/colour/colour.ts";

export default function ({ results, parties, thumbnail }: Lume.Data) {
  const pts = Object.keys(parties);
  let html = '<table class="results"><tbody>';
  let r, i, key, party, c, src, total, pc, w, v;

  total = results.total_votes || 0;
  if (total == 0) {
    for (i = 0; i < results.votes.length; i++) {
      if (
        typeof results.votes[i].votes === "number" && results.votes[i].votes > 0
      ) {
        total += results.votes[i].votes;
      }
    }
  }

  const sortedVotes = results.votes.toSorted((a, b) => {
    const v = b.votes - a.votes;
    if (v !== 0) return v;
    const n = a.person_name < b.person_name ? -1 : 1;
    return n;
  })
  for (i = 0; i < sortedVotes.length; i++) {
    r = sortedVotes[i];
    party = r.party_key;
    key = pts.includes(party) ? party : "other";
    c = parties[party].colour;
    v = r.votes || 0;
    if (total > 0) {
      pc = (100 * v / total).toFixed(1) + "%";
      w = (60 * v / total).toFixed(1);
      v = v.toLocaleString() + " votes";
    } else {
      pc = "";
      w = "0";
      v = "";
    }

    html += '<tr title="' + r.person_name + " (" + r.party_name + ")";
	if(results.confirmed) html += pc + (v ? "(" + v + ")" : v);
	html += '"';
	html += ' data-party="' + party + '"';
	html += ' data-id="' + r.person_id + '">';
    html += "<td>";
    src = thumbnail(r.person_id) || "/assets/images/missing.svg"; // r.image
    html += '<a href="https://whocanivotefor.co.uk/person/' + r.person_id +
      '/" title="' + r.person_name + '"><img src="' + src +
      '" alt="Photograph of ' + r.person_name + '"/></a>';
    html += "</td>";
    html += "<td>";
    html += '<span class="party-bar" style="width:' + w + "%;background:" +
      c + ";color:" + Colour(c).contrast + ';"></span>';
    html += '<span class="party">' + (party != "other" ? parties[party].pa : r.party_name) +
      "</span>";
	html += '<span class="percent">' + (results.confirmed && pc ? '<strong>'+pc+'</strong>' : '') + "</span>";
    html += '<br /><span class="candidate">' + r.person_name + "</span>";
    html += "</td>";
    html += "</tr>";
  }
  html += "</table>";
  return html;
}
