import { Field } from "lume/cms/static/components/field.js";
import { push } from "lume/cms/static/components/utils.js";

customElements.define(
  "result-table",
  class extends Field {
    init() {
      this.classList.add("field");

      const { schema, value } = this;
      const namePrefix = `${this.namePrefix}.${schema.name}`;

      push(this, "label", {
        for: `field_${namePrefix}.0`,
      }, schema.label);

      const table = push(this, "table");

      let index = 0;

      function addRow(value) {
        index++;
        const row = push(table, "tr");
        for (const c of schema.fields) {
          const cell = push(row, "td");
          const config = {
            schema: c,
            namePrefix: [namePrefix, index].join("."),
            value: value[c.name],
          };
          push(cell, c.tag, config);
        }
      }

      for (const v of value) {
        addRow(v);
      }

      // Here your code
    }
  },
);
