var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// lib/custom-cms-fields.ts
import { Field } from "https://cdn.jsdelivr.net/gh/lumeland/cms@v0.5.2/static/components/field.js";
import { push } from "https://cdn.jsdelivr.net/gh/lumeland/cms@v0.5.2/static/components/utils.js";
customElements.define(
  "result-table",
  class extends Field {
    init() {
      this.classList.add("field");
      const { schema, value } = this;
      const namePrefix = `${this.namePrefix}.${schema.name}`;
      push(this, "label", {
        for: `field_${namePrefix}.0`
      }, schema.label);
      const table = push(this, "table");
      let index = 0;
      function addRow(value2) {
        index++;
        const row = push(table, "tr");
        for (const c of schema.fields) {
          const cell = push(row, "td");
          const config = {
            schema: c,
            namePrefix: [namePrefix, index].join("."),
            value: value2[c.name]
          };
          push(cell, c.tag, config);
        }
      }
      __name(addRow, "addRow");
      for (const v of value) {
        addRow(v);
      }
    }
  }
);
