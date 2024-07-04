export type HexData = {
  n: string;
};

export type Notional = {
  pcon24cd: string;
  party_key: string;
  majority: number;
  valid_votes: number;
  [key: string]: unknown;
};

export type Vote = {
  person_id: string;
  person_name: string;
  party_key: string;
  party_name: string;
  votes: number;
  image: string;
  [key: string]: unknown;
};

type Time = string;
type Date = string;
type DateTime = string;
export type Result = {
  pcon24cd: string;
  pcon24nm: string;
  total_votes: number;
  electorate: number;
  turnout_pct: number;
  confirmed: boolean;
  declaration_date: Date;
  declaration_time: Time;
  last_updated: DateTime;
  votes: Vote[];
};

export type Results = {
  [pcon24cd: string]: Result;
};

type LumeCommon = {
  layout: string;
  tags: string[];
}
export type ConstituencyPage = LumeCommon & {
  title: string;
  description: string;
  metas: { image: string };
  url: string;
  pcon24cd: string;
  pcon24nm: string;
  results: Result;
  notional: Notional;
  winner: Vote & { majority?: number };
  date: DateTime;
  drilldown: unknown;
  age: unknown;
  housing_tenure: unknown;
};

export type SocialImage = {
  name: string;
  headline: string;
  candidate: string;
  party_key: string;
  previous_key: string;
  provisional: boolean;
  image: string;
  results: null;
  drilldown: null;
  age: null;
  housing_tenure: null;
}