import { ConstituencyPage, HexData, Notional, Results, SocialImage } from "../../types.ts";

export default function* ({
  hexjson: {
    constituencies: {
      hexes: constituencies,
    },
  },
  notional: allNotional,
  results: allResults,
  drilldown,
  age,
  housing_tenure,
}: Lume.Data & { notional: Notional[]; results: Results }): Generator<
  ConstituencyPage | SocialImage
> {
  for (
    const [pcon24cd, { n: pcon24nm }] of Object.entries<HexData>(constituencies)
  ) {
    // Get just the results for this consticuency
    const results = allResults![pcon24cd] || {};

    // Sort the votes by person name
    if (results.votes) {
      results.votes.sort((a, b) => a.person_name < b.person_name ? -1 : 1);
    }

    // Filter the votes with a result, sort by votes
    const ballot = results.votes
      .toSorted((a, b) => b.votes - a.votes)
      .filter((x) => x.votes > 0);

    // The winner is the one with the most votes. That's how this works
    const winner = ballot[0] || null;

    if (winner) {
      // We will disregard votes of below this clip in calculating majority, as it's probably work in progress
      const LOW_VOTE_CLIP = 10;
      const majority =
        winner && ballot[0] && ballot[0].votes > LOW_VOTE_CLIP && ballot[1] &&
          ballot[1].votes > LOW_VOTE_CLIP
          ? ballot[0].votes - ballot[1].votes
          : null;

      winner.majority = majority;
    }

    // Extract the notional results for the constituency
    const notional = allNotional.find((x) => x.pcon24cd == pcon24cd)!;

    // Set some metadata
    let description = `Awaiting result for ${pcon24nm}.`;

    const metas = {
      image: `https://ge2024.hexmap.uk/assets/social/${ pcon24cd }.svg`,
    };
    
    let headline = "Awaiting result";
    
    if (winner) {
      const provisional = results.confirmed ? "" : " provisionally";

      headline = `${winner.party_name} ${
        notional.party_key ==
            winner.party_key
          ? `HOLD`
          : `GAIN`
      }`;
      description =
        `${headline}. ${winner.person_name} (${winner.party_name})${provisional} elected to ${pcon24nm}.`;
    }

    // Generate social share image
    yield {
      layout: 'social_share.vto',
      url: `/assets/social/${ pcon24cd }.svg`,
      name: pcon24nm,
      headline: headline,
      party_key: winner?.party_key || "none",
      previous_key: notional.party_key,
      candidate: winner?.person_name || "",
      image: metas.image,
      provisional: winner && !results.confirmed || false,
      results: null,
      drilldown: null,
      age: null,
      housing_tenure: null,
    }

    // Return all the data
    yield {
      layout: "constituency.vto",
      tags: ["constituency"],
      title: pcon24nm,
      description,
      metas,
      url: `/constituency/${pcon24cd}/`,
      pcon24cd,
      pcon24nm,
      results,
      notional,
      winner,
      headline,
      date: results?.last_updated,
      drilldown: drilldown[pcon24cd] || null,
      age: age[pcon24cd] || null,
      housing_tenure: housing_tenure[pcon24cd] || null,
    };
  }
}
