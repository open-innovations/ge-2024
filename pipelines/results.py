import os
import json
from pathlib import Path

import petl as etl
from tqdm import tqdm

INPUT_DIR = Path('data/')
DATA_DIR = Path('src/constituency/_data/')


def create_results(constituency):
    target_file = DATA_DIR / f'results/{ constituency }.json'

    data = {
        'pcon24cd': constituency,
        'pcon24nm': constituency_lookup[constituency],
        'total_votes': None,
        'electorate': None,
        'turnout_pct': None,
        'confirmed': False,
        'declaration_date': None,
        'declaration_time': None,
        'last_updated': None,
    }

    results = candidates.selecteq(
        'pcon24cd', constituency
    ).addfield(
        'votes', None
    )

    if not reset:
        try:
            with open(target_file) as json_file:
                current_data = json.load(json_file)
            data.update(current_data)
            results = results.leftjoin(
                etl.fromdicts(
                    current_data['votes']
                ).cut(
                    'person_id', 'votes'
                ), key='person_id'
            )
        except:
            pass

    data['votes'] = list(results.cutout('pcon24cd', 'post_label').dicts())

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
    global reset
    reset = os.environ.get('RESET_RESULTS') == 'RESET'
    main()
