from urllib.parse import urlencode, urlunsplit
from pathlib import Path
import json
from rapidfuzz.process import extractOne
from rapidfuzz.fuzz import WRatio

import petl as etl

SOURCE = Path('data')
TARGET = Path('src/_data/')

with open(TARGET / 'hexjson/constituencies.hexjson') as f:
    constituency_lookup = dict(
        (key, value['n']) for key, value in json.load(f)['hexes'].items())


def constituency_matcher(row):
    match = extractOne(row.post_label, constituency_lookup)
    return match[2]


def build_url():
    scheme = "https"
    server = "candidates.democracyclub.org.uk"
    path = "/data/export_csv/"

    query = urlencode([
        ("election_id", "^parl\.2024-07-04$"),
        ("cancelled", "False"),
        ("extra_fields", "gss"),
        ("extra_fields", "image"),
        ("extra_fields", "favourite_biscuit"),
        ("format", "csv"),
    ])

    return urlunsplit((scheme, server, path, query, ""))


def main():
    TARGET.mkdir(parents=True, exist_ok=True)

    # Load reference tables
    party_lookup = etl.fromcsv(SOURCE / 'lookup_party.csv')

    # Get the data
    source = etl.fromcsv(
        build_url()
    ).leftjoin(
        right=party_lookup, key="party_id"
    ).replace(
        field="party_key", a=None, b="other"
    ).addfield(
        "pcon24cd", constituency_matcher,
    )

    source.select(
        lambda r: r.gss != r.pcon24cd
    ).tocsv(SOURCE / 'candidates_mismatch.csv')

    # Save to JSON
    source.sort(
        key="person_id"
    ).cut(
        'person_id',
        'person_name',
        'image',
        'election_id',
        'party_key',
        'party_name',
        'pcon24cd',
        'post_label',
        'cancelled_poll',
    ).tojson(
        source=TARGET / 'candidates.json',
        indent=2
    )

    # Count parties
    source.aggregate(
        key=('party_key'), aggregation=len, field='candidate_count'
    ).sort(
        key='candidate_count', reverse=True
    ).tojson(
        source=TARGET / 'party_summary.json',
        indent=2
    )


if __name__ == "__main__":
    main()
