export function buildLegend(data, column, labelcol, labels = {}, parties) {

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
    if (party in parties) lbl = parties[lbl].pa;
    else console.warn("No match for " + lbl + " (" + party + ")");
	if(lbl==null || lbl=="null") lbl = "None";
    legend.push({
      "colour": party||"#dfdfdf",
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
