from urllib.parse import urlencode, urlunsplit
from pathlib import Path

import petl as etl

SOURCE = Path('data')
TARGET = Path('src/_data/')


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
    ).cut(
        'person_id',
        'person_name',
        'image',
        'election_id',
        'party_id',
        'party_name',
        'gss',
        'post_label',
        'cancelled_poll',
        'favourite_biscuit',
    ).leftjoin(
        right=party_lookup, key="party_id"
    ).replace(
        field="party_key", a=None, b="other"
    )

    # Save to csv
    source.sort(
        key="person_id"
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
