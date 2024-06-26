from pathlib import Path
import petl as etl

SOURCE = Path('data')
TARGET = Path('src/_data/')


def main():
    data = etl.fromcsv(
        "https://electionresults.parliament.uk/general-elections/5/majority.csv")

    data.rename(
      {
        'Constituency geographic code': 'pcon24cd',
        'Constituency name': 'pcon24nm',
        'Winning main party abbreviation': 'party_key',
        'Winning main party name': 'party_name',
        'Winning candidate standing as Commons Speaker': 'speaker',
        'Winning candidate standing as independent': 'independent',
        'Majority': 'majority',
        'Valid vote count': 'valid_votes'
      }
    ).replace(
      'party_key', '', 'speaker',
      where=lambda r: r.speaker == 'true'
    ).cut(
      'pcon24cd',
      'pcon24nm',
      'party_key',
      'party_name',
      'majority',
      'valid_votes'
    ).convert(
      'party_key', 'lower'
    ).convertnumbers(
    ).tojson(
      TARGET / 'notional.json'
    )

if __name__ == "__main__":
    main()
