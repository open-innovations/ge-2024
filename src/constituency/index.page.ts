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
      votes: {
        votes: number;
        [key: string]: unknown;
      }[];
    };
  };
}) {
  for (
    const [pcon24cd, { n: pcon24nm }] of Object.entries<HexData>(constituencies)
  ) {
    const localResults = results![pcon24cd] || {};

    const resultsCount = localResults
      .votes
      .filter((x) => x.votes > 0)
      .length;

    const winner = resultsCount > 0
      ? localResults.votes.sort((a, b) => b.votes - a.votes)[0]
      : null;

    const overrideNotional = notional.find((x) => x.pcon24cd == pcon24cd);

    yield {
      title: pcon24nm,
      url: `/constituency/${pcon24cd}/`,
      pcon24cd,
      pcon24nm,
      results: localResults,
      notional: overrideNotional,
      winner,
    };
  }
}
