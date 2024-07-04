import json
import os
from pathlib import Path

import petl as etl
from tqdm import tqdm

INPUT_DIR = Path('data/')
DATA_DIR = Path('src/constituency/_data/')


def create_results(constituency):
    target_file = DATA_DIR / f'results/{ constituency }.json'

    current_data = {}

    if not reset:
        try:
            with open(target_file) as json_file:
                current_data = json.load(json_file)
        except:
            pass

    def check_current(k):
        return current_data[k] if k in current_data and current_data[k] else None

    def check_votes(entry):
        if not 'votes' in current_data:
            return entry

        current_votes = next(
            v for v in current_data['votes'] if v['person_id'] == entry['person_id'])

        if current_votes:
            entry['votes'] = current_votes['votes'] if 'votes' in current_votes and current_votes['votes'] else None

        return entry

    data = {
        'pcon24cd': constituency,
        'pcon24nm': constituency_lookup[constituency],
        'total_votes': check_current('total_votes'),
        'electorate': check_current('constituency') or electorate[constituency] if constituency in electorate else None,
        'turnout_pct': check_current('turnout_pct'),
        'confirmed': check_current('confirmed') or False,
        'declaration_date': check_current('declaration_date'),
        'declaration_time': check_current('declaration_time'),
        'last_updated': check_current('last_updated'),
    }

    results = candidates.selecteq(
        'pcon24cd', constituency
    ).addfield(
        'votes', None
    )

    data['votes'] = [
        check_votes(c)
        for c in list(results.cutout('pcon24cd', 'post_label').dicts())
    ]

    with open(target_file, 'w') as json_file:
        json.dump(data, json_file, indent=2)


def main():
    global candidates
    global constituency_lookup
    global electorate

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

    electorate = etl.fromcsv(
        "https://cdn.jsdelivr.net/gh/open-innovations/constituencies@main/src/_data/sources/society/2023-constituency-electorate.csv"
    ).convert(
        "Electorate", int
    ).lookupone(
        "PCON25CD", "Electorate"
    )

    print('S14000084' in electorate)

    exit

    for constituency in tqdm(set(candidates.values('pcon24cd'))):
        create_results(constituency)


if __name__ == "__main__":
    global reset
    reset = os.environ.get('RESET_RESULTS') == 'RESET'
    main()
