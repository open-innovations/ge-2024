export function buildLegend(data, column, labelcol, labels = {}) {
  // From https://election.pressassociation.com/general-election/general-election-2024/
  const pacodes = {
    "con": "Con",
    "lab": "Lab",
    "ld": "LD",
    "pc": "PC",
    "snp": "SNP",
    "green": "Green",
    "ref": "Reform",
    "ind": "Ind",
    "dup": "DUP",
    "sf": "SF",
    "sdlp": "SDLP",
    "apni": "Alliance",

    "Conservative": "Con",
    "Labour": "Lab",
    "Liberal Democrat": "LD",
    "Plaid Cymru": "PC",
    "Scottish National Party": "SNP",
    "Green": "Green",
    "Green Party": "Green",
    "UK Independence Party": "UKIP",
    "Democratic Unionist Party": "DUP",
    "Ulster Unionist Party": "UUP",
    "Social Democratic and Labour Party": "SDLP",
    "Alba": "Alba",
    "Sinn Féin": "SF",
    "Alliance": "Alliance",
    "Reform UK": "Reform",
    "Workers Party of Britain": "WPB",
    "Abolish the Welsh Assembly Party": "Abolish",
    "Alliance for Democracy and Freedom": "ADF",
    "Alliance for Green Socialism": "Green Soc",
    "Animal Welfare Party": "AWP",
    "Aontu": "Aontu",
    "Ashfield Independents": "Ashfield",
    "Blue Revolution": "Blue",
    "British Democratic Party": "BDP",
    "British Unionist Party": "BUP",
    "Chesterfield Independents": "Chesterfield",
    "Christian Party": "Christian",
    "Christian Peoples Alliance": "CPA",
    "Climate": "Climate",
    "Communist Future": "Comm Future",
    "Communist League": "Comm Lge",
    "Communist Party of Britain": "Comm Brit",
    "Confelicity": "Confelicity",
    "Consensus": "Consensus",
    "Count Binface Party": "Binface",
    "Cross-Community Labour Alternative": "CCLA",
    "Democracy for Chorley": "Chorley",
    "English Constitution Party": "ECP",
    "English Democrats": "Eng Dem",
    "Fairer Voting Party": "FVP",
    "Freedom Alliance": "FA",
    "Hampshire Independents": "HampInd",
    "Heritage Party": "Heritage",
    "Independence for Scotland": "Ind Scot",
    "Independents for Direct Democracy": "IDD",
    "Kingston Independent Residents Group": "KIRG",
    "Liberal": "Lib",
    "Libertarian Party": "Libertarian",
    "Lincolnshire Independents": "Lincs",
    "Liverpool Community Independents": "LCI",
    "Monster Raving Loony Party": "Loony",
    "National Health Action Party": "NHAP",
    "New Open Non-Political Organised Leadership": "NonPol",
    "One Leicester": "One Leicester",
    "Party of Women": "PartyWomen",
    "People Before Profit": "PBP",
    "Portsmouth Independent Party": "Portsmouth",
    "Propel": "Propel",
    "Psychedelic Future Party": "PFP",
    "Putting Crewe First": "Crewe",
    "Rebooting Democracy": "Rebooting",
    "Rejoin EU": "Rejoin",
    "Save Us Now": "Save",
    "Scottish Christian Party": "SCP",
    "Scottish Family Party": "Scot Family",
    "Scottish Libertarian Party": "SLP",
    "Scottish Socialist Party": "SSP",
    "Shared Ground": "SG",
    "Social Democratic Party": "Soc Dem",
    "Social Democratic &amp; Labour Party": "Soc Dem",
    "Social Justice Party": "SJP",
    "Socialist Equality": "Soc Eq",
    "Socialist Labour Party": "Soc Lab",
    "Socialist Party of Great Britain": "SPGB",
    "South Devon Alliance": "Devon",
    "Sovereignty": "Sovereignty",
    "Stockport Fights Austerity No to Cuts": "Stockport",
    "Swale Indpendents": "Swale",
    "Taking The Initiative Party": "TTIP",
    "The Common Good": "Good",
    "The Common People": "People",
    "The Mitre TW9": "Mitre",
    "The North East Party": "NE Party",
    "The Peace Party": "Peace",
    "The Speaker": "Speaker",
    "speaker": "Speaker",
    "The Yorkshire Party": "Yorkshire",
    "The Yoruba Party in the UK": "Yoruba",
    "Trade Unionist and Socialist Coalition": "TUSC",
    "Traditional Unionist Voice": "TUV",
    "Transform": "Transform",
    "True & Fair": "True",
    "UK Voice": "Voice",
    "Volt": "Volt",
    "Women’s Equality Party": "Women",
    "Workers’ Revolutionary Party": "WRP",
  };

  const lookup = {};
  for (let r = 0; r < data.length; r++) {
    const v = data[r][column];
    if (v) {
      if (!lookup[v]) lookup[v] = { "count": 0, "label": v };
      lookup[v].count++;
      if (labelcol && labelcol in data[r]) lookup[v].label = data[r][labelcol];
    }
  }

  const legend = [];
  for (const party in lookup) {
    let lbl = lookup[party].label;
    if (lbl in labels) lbl = labels[lbl];
    if (party in labels) lbl = labels[party];
    if (lbl in pacodes) lbl = pacodes[lbl];
    else console.warn("No match for " + lbl + " (" + party + ")");
    legend.push({
      "colour": party,
      "count": lookup[party].count,
      "label": lbl + ": " + lookup[party].count,
    });
  }
  legend.sort(function (a, b) {
    if (a.colour == "Spk") return -1;
    if (b.colour == "Spk") return 1;
    // Sort by count
    if (a.count - b.count != 0) return (a.count - b.count);
    // Fall back to sorting by label
    return (a.label.toLowerCase() < b.label.toLowerCase() ? 1 : -1);
  });

  return legend;
}
