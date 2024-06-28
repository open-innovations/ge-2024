import json
from pathlib import Path

import petl as etl
from tqdm import tqdm

INPUT_DIR = Path('data/')
DATA_DIR = Path('src/constituency/_data/')


def create_results(constituency):
    target_file = DATA_DIR / f'results/{ constituency }.json'

    results = candidates.selecteq(
        'pcon24cd', constituency
    ).addfield(
        'votes', None
    )

    # TODO merge any existing votes

    data = {
        'pcon24cd': constituency,
        'pcon24nm': constituency_lookup[constituency],
        'total_votes': None,
        'electorate': None,
        'turnout_pct': None,
        'confirmed': False,
        'votes': list(results.cutout('pcon24cd', 'post_label').dicts()),
    }

    with open(target_file, 'w') as json_file:
        json.dump(data, json_file, indent=2)


def main():
    global candidates
    global constituency_lookup
    candidates = etl.fromcsv(
        INPUT_DIR / 'candidates.csv'
    ).cut(
        'person_id',
        'person_name',
        'image',
        'party_key',
        'party_name',
        'pcon24cd',
        'post_label'
    )

    constituency_lookup = etl.lookupone(
        candidates,
        'pcon24cd', 'post_label'
    )


    for constituency in tqdm(set(candidates.values('pcon24cd'))):
        create_results(constituency)


if __name__ == "__main__":
    main()
