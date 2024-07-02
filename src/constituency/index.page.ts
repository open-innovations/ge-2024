export const layout = "constituency.vto";
export const tags = ["constituency"];

type HexData = {
  n: string;
};

export default function* ({
  hexjson: {
    constituencies: {
      hexes: constituencies,
    },
  },
  notional,
  results,
}: Lume.Data & {
  notional: {
    pcon24cd: string;
    party_key: string;
    majority: number;
    valid_votes: number;
    [key: string]: unknown;
  }[];
  results: {
    [key: string]: {
      confirmed: boolean;
      votes: {
        person_id: string;
        votes: number;
        image: string;
        [key: string]: unknown;
      }[];
    };
  };
}) {
  for (
    const [pcon24cd, { n: pcon24nm }] of Object.entries<HexData>(constituencies)
  ) {
    const localResults = results![pcon24cd] || {};

    if (localResults.votes) {
      localResults.votes.sort((a, b) => a.person_name < b.person_name ? -1 : 1);
    }

    const resultsCount = localResults
      .votes
      .filter((x) => x.votes > 0)
      .length;

    const winner = resultsCount > 0
      ? localResults.votes.toSorted((a, b) => b.votes - a.votes)[0]
      : null;

    const overrideNotional = notional.find((x) => x.pcon24cd == pcon24cd);

    let description = `No result available for ${pcon24nm}.`;

    const metas = {
      image: "https://placehold.co/400/svg?text=Awaiting+result",
    };

    if (winner) {
      const provisional = localResults.confirmed ? "" : " provisionally";

      const headline = `${winner.party_name} ${
        overrideNotional.party_key ==
            winner.party_key
          ? `hold`
          : `gain`
      }`;
      description =
        `${headline}. ${winner.person_name} (${winner.party_name})${provisional} elected to ${pcon24nm}.`;
      metas.image = winner.image;
    }

    yield {
      title: pcon24nm,
      description,
      metas,
      url: `/constituency/${pcon24cd}/`,
      pcon24cd,
      pcon24nm,
      results: localResults,
      notional: overrideNotional,
      winner,
    };
  }
}
