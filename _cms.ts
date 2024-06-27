import lumeCMS from "lume/cms/mod.ts";
import GitHub from "lume/cms/storage/github.ts";
import { Data, ResolvedField } from "lume/cms/types.ts";
import { Octokit } from "npm:octokit@4.0.2";

const client = new Octokit({
  auth: Deno.env.get("GITHUB_TOKEN"),
});

const cms = lumeCMS({
  site: {
    name: "OI General Election 24 Tracker",
  },
  extraHead: `
  <style>
    a[href*="/admin/collection/results/create"],
    button[formaction*="/admin/collection/results/delete"] {
      display: none;
    }
  </style>
  `,
});

cms.storage(
  "gh",
  new GitHub({
    client,
    owner: "open-innovations",
    repo: "ge-2024",
  }),
);

cms.field("result-table", {
  tag: "result-table",
  jsImport: "/assets/js/custom-cms-fields.js",
  async applyChanges(data, changes, field: ResolvedField) {
    const currentData = data[field.name] as Data[] || [];

    console.log({
      currentData,
    });
    const value = await Promise.all(
      Object.values(changes[field.name] || {}).map(
        async (subchanges, index) => {
          const value = currentData[index] || {};

          for (const f of field.fields || []) {
            await f.applyChanges(value, subchanges, f);
          }

          return value;
        },
      ),
    );

    const fn = field.transform;
    data[field.name] = fn ? fn(value, field) : value;
  },
});

cms.collection("results", "src:_data/results/*.json", [
  {
    name: "pcon24nm",
    label: "Constituency",
    type: "text",
    attributes: {
      readonly: true,
    },
  },
  {
    name: "pcon24cd",
    type: "hidden",
    attributes: {
      readonly: true,
    },
  },
  {
    name: "votes",
    type: "result-table",
    fields: [
      {
        name: "person_name",
        type: "text",
        attributes: {
          readonly: true,
        },
      },
      {
        name: "party_name",
        type: "text",
        attributes: {
          readonly: true,
        },
      },
      {
        name: "votes",
        type: "number",
        attributes: {
          min: 0,
        },
      },
      {
        name: "person_id",
        type: "hidden",
        attributes: {
          readonly: true,
        },
      },
      {
        name: "image",
        type: "hidden",
        attributes: {
          readonly: true,
        },
      },
    ],
  },
  {
    name: "confirmed",
    type: "checkbox",
  },
]);

// Deno.exit()
export default cms;
