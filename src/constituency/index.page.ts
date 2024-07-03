export const layout = "constituency.vto";
export const tags = ["constituency"];

type HexData = {
  n: string;
};

type Notional = {
  pcon24cd: string;
  party_key: string;
  majority: number;
  valid_votes: number;
  [key: string]: unknown;
};

type Results = {
  [key: string]: {
    confirmed: boolean;
    votes: {
      person_id: string;
      person_name: string;
      votes: number;
      image: string;
      [key: string]: unknown;
    }[];
  };
};

export default function* ({
  hexjson: {
    constituencies: {
      hexes: constituencies,
    },
  },
  notional: allNotional,
  results: allResults,
}: Lume.Data & { notional: Notional[]; results: Results }) {
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
      const majority = winner && ballot[0] && ballot[0].votes > LOW_VOTE_CLIP && ballot[1] && ballot[1].votes > LOW_VOTE_CLIP ? ballot[0].votes - ballot[1].votes : null;

      winner.majority = majority;
    }

    // Extract the notional results for the constituency
    const notional = allNotional.find((x) => x.pcon24cd == pcon24cd)!;

    // Set some metadata
    let description = `Awaiting result for ${pcon24nm}.`;

    const metas = {
      image: "https://placehold.co/400/svg?text=Awaiting+result",
    };

    if (winner) {
      const provisional = results.confirmed ? "" : " provisionally";

      const headline = `${winner.party_name} ${
        notional.party_key ==
            winner.party_key
          ? `HOLD`
          : `GAIN`
      }`;
      description =
        `${headline}. ${winner.person_name} (${winner.party_name})${provisional} elected to ${pcon24nm}.`;
      metas.image = winner.image;
    }

    // Return all the data
    yield {
      title: pcon24nm,
      description,
      metas,
      url: `/constituency/${pcon24cd}/`,
      pcon24cd,
      pcon24nm,
      results,
      notional,
      winner,
    };
  }
}
