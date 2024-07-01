function divWrap(...elements: HTMLElement[]) {
  const div = document.createElement("div");
  div.append(...elements);
  return div;
}
function labelFor(element: HTMLInputElement, text: string) {
  const label = document.createElement("label");
  label.setAttribute("for", element.id);
  label.innerHTML = text;
  return label;
}

function init() {
  const listContainer = document.querySelector("#constituency-list");
  if (!listContainer) return;

  const list = listContainer.querySelectorAll("li");

  const nameFilter = document.createElement("input");
  nameFilter.id = "name-filter";
  nameFilter.type = "text";

  const resultsFilter = document.createElement("input");
  resultsFilter.id = "results-filter";
  resultsFilter.type = "checkbox";

  const confirmedFilter = document.createElement("input");
  confirmedFilter.id = "confirmed-filter";
  confirmedFilter.type = "checkbox";

  const form = document.createElement("form");
  form.id = "constituency-filter";

  form.append(
    divWrap(
      labelFor(nameFilter, "Constituency name"),
      nameFilter,
    ),
    divWrap(
      resultsFilter,
      labelFor(resultsFilter, "Has results?"),
    ),
    divWrap(
      confirmedFilter,
      labelFor(confirmedFilter, "Results are confirmed?"),
    ),
  );

  function filter(this: HTMLInputElement) {
    const name = nameFilter.value.toUpperCase();
    list.forEach((c) => {
      c!.hidden = (
        name.length > 0 ? c.dataset.name!.match(name) == null : false
      ) || (
        resultsFilter.checked ? c.dataset.winner == "" : false
      ) || (
        confirmedFilter.checked ? c.dataset.confirmed == "false" : false
      );
    });
  }
  form.addEventListener("input", filter);
  listContainer.parentElement!.insertBefore(form, listContainer);
}

addEventListener("DOMContentLoaded", init);
