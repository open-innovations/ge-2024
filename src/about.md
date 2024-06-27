---
title: About this site
---

# About this site

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

## CMS

The CMS for the site is available at <https://ge-2024.deno.dev/>. You will need
a password.
