---
title: About this site
templateEngine: vto, markdown
---

This site shows data for the 2024 UK General Election on a hex map and by constituency.

## Hex maps

At Open Innovations we have a bit of a reputation for hex maps (technically, cartograms). When it comes to showing data about constituencies - where every constituency should have an equal visual weight in a visualisation - [we think hex maps do a better job](https://open-innovations.org/blog/2017-05-08-mapping-election-with-hexes) than geographic maps. Particularly, strictly geographic representations of constituencies biases the overall impression in favour of the much larger, rural constituencies and effectively hides geographically small inner city constituencies. Obviously there are trade-offs when you abstract the geography - individual constituencies can't necessarily preserve their real-life neighbours and so relative positions do get distorted - but we feel that getting the correct overall impression from a visualisation matters more.

Given the 2023 boundary reviews we are using our new constituency hex. We have a [blog post about the design of the layout](https://open-innovations.org/blog/2023-08-03-hexes-for-the-next-general-election) including some of the reasoning behind it. If you are particularly unhappy with the layout, you can try to [edit the layout](https://open-innovations.org/projects/hexmaps/builder.html?https://raw.githubusercontent.com/odileeds/hexmaps/gh-pages/maps/uk-constituencies-2023.hexjson) and send us the new HexJSON.

<div> <!-- HODL -->

## Data sources and pipelines

| Data source  | Publisher        | License   | Details                                                                                                                                                             |
| ------------ | ---------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `candidates` | Democracy Club   | CC-BY-4.0 | Details of candidates standing in the UK General Election held on 4th July 2024. Subset of overall dataset downloaded via [CSV link][CANDIDATES].                   |
| `notional`   | UK Parliament    |           | Analysis of outcome of the 2019 General Election results projected onto the new constituency boundaries. Retrieved from the [UK Parliament results site][NOTIONAL]. |
| `hexmap`     | Open Innovations |           | Layout of the hex cartogram used to display election results                                                                                                        |

[CANDIDATES]: https://candidates.democracyclub.org.uk/data/export_csv/?election_id=%5Eparl%5C.2024-07-04%24&cancelled=False&extra_fields=gss&extra_fields=image&extra_fields=favourite_biscuit&format=csv
[NOTIONAL]: https://electionresults.parliament.uk/general-elections/5/majority

The pipelines to process this data are written in Python, using the PETL
library. They are orchestrated using DVC.

| Pipeline                     | Description                                                                                                                                                                                                                                                                               |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`candidates`][P_candidates] | Download `candidates` data and prepare for the site. Fuzzy match constituency names with correct PCON24 codes. Save a json file of all candidates, a summary of parties and a csv of mismatched candidates (where the derived PCON24 code does not match the one held by Democracy Club). |
| [`notional`][P_notional]     | Download `notional` data and prepare for the site.                                                                                                                                                                                                                                        |
| [`results`][P_result]        | Prepare empty `results` files for each constituency. TODO combine existing results if present.                                                                                                                                                                                            |

[P_candidates]: https://github.com/open-innovations/ge-2024/blob/main/pipelines/candidates.py
[P_notional]: https://github.com/open-innovations/ge-2024/blob/main/pipelines/notional.py
[P_result]: https://github.com/open-innovations/ge-2024/blob/main/pipelines/results.py

## Data model

{{ comp mermaid }}
erDiagram
  RESULTS {
    string pcon24cd PK "Constituency ONS code"
    string pcon24nm "Constituency name"
    number total_votes "Total votes cast"
    number electorate "Count of registered voters"
    number turnout_pct "Percentage turnout"
    boolean confirmed "True if result is confirmed"
    list votes "List of votes recorded per candidate"
  }
  VOTE {
    string person_id FK "Candidate id (from Democracy Club)"
    string person_name "Candidate name (from Democracy Club)"
    url image "Profile photo of candidate (from Democracy Club, or placeholder if undefined)"
    string party_key FK "Party identifier"
    string party_name "Unique party name"
    number votes "Number of votes cast for candidate"
  }
  PARTIES {
    string key PK "Party unique identifier"
    string name "Party name (or Other)"
  }
  NOTIONAL {
    string pcon24cd PK "ONS code"
    string pcon24cd "ONS name"
    string party_key FK "Incumbent party"
    number majority "Size of majority"
    number valid_votes "Valid votes cast"
  }
  CONSTITUENCY_HEXES {
      string key PK "Constituency ONS code"
      string n "Constituency name"
  }
  RESULTS ||--|| CONSTITUENCY_HEXES: pcon24cd
  RESULTS ||--|{ VOTE: "pcon24cd (implied)"
  VOTE }|-- || PARTIES: party_key
  NOTIONAL ||--|| CONSTITUENCY_HEXES: pcon24cd
  NOTIONAL }|-- || PARTIES: party_key
{{ /comp }}

## CMS

The CMS for the site is available at <{{ cms }}>. You will need a password.

</div>