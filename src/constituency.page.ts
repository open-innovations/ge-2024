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
  candidates,
  notional,
  results,
}: Lume.Data & {
  candidates: {
    [key: string]: string;
  }[];
  notional: {
    pcon24cd: string;
    party_key: string;
    majority: number;
    valid_votes: number;
    [key: string]: unknown;
  }[];
  results: {
    [key: string]: unknown;
  };
}) {
  for (
    const [pcon24cd, { n: pcon24nm }] of Object.entries<HexData>(constituencies)
  ) {
    const localCandidates = candidates
      .filter((c) => c.pcon24cd === pcon24cd)
      .map((x) => ({
        person_id: x.person_id,
        name: x.person_name,
        image: x.image,
        party_key: x.party_key,
        party_name: x.party_name,
      }));

    if (localCandidates.length < 1) {
      console.warn({ pcon24cd, localCandidates });
      throw new Error("Missing PCON code");
    }

    const localResults = results![pcon24cd] || {};

    const overrideNotional = notional.find((x) => x.pcon24cd == pcon24cd);

    yield {
      title: pcon24nm,
      url: `/constituency/${pcon24cd}/`,
      pcon24cd,
      pcon24nm,
      candidates: localCandidates,
      results: localResults,
      notional: overrideNotional,
    };
  }
}
