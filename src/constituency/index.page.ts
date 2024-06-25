export const layout = "constituency.vto";

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
}: Lume.Data) {
  for (
    const [pcon24cd, { n: pcon24nm }] of Object.entries<HexData>(constituencies)
  ) {
    const localCandidates = candidates
      .filter((c) => c.gss === pcon24cd)
      .map((x) => ({
        person_id: x.person_id,
        name: x.person_name,
        party_key: x.party_key,
        party_name: x.party_name,
      }));

    if (localCandidates.length < 1) {
      console.warn({ pcon24cd, localCandidates });
    }

    yield {
      title: pcon24nm,
      url: `/constituency/${pcon24cd}/`,
      pcon24cd,
      pcon24nm,
      local: {
        candidates: localCandidates,
      },
    };
  }
}
