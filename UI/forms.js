/* Adlaire-Design form interactions */
(function () {
  "use strict";

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function applyFilter(root) {
    var queryInput = root.querySelector("[data-adlaire-filter-input]");
    var activeChip = root.querySelector("[data-adlaire-filter-chip][aria-pressed='true']");
    var query = normalize(queryInput ? queryInput.value : "");
    var filter = normalize(activeChip ? activeChip.getAttribute("data-adlaire-filter-chip") : "");

    root.querySelectorAll("[data-adlaire-filter-item]").forEach(function (item) {
      var text = normalize(item.textContent);
      var group = normalize(item.getAttribute("data-adlaire-filter-item"));
      var matchesQuery = !query || text.indexOf(query) !== -1;
      var matchesFilter = !filter || group === filter;
      item.hidden = !(matchesQuery && matchesFilter);
    });
  }

  document.addEventListener("input", function (event) {
    var input = event.target.closest("[data-adlaire-filter-input]");
    var root = input ? input.closest("[data-adlaire-filter]") : null;
    if (root) {
      applyFilter(root);
    }
  });

  document.addEventListener("click", function (event) {
    var chip = event.target.closest("[data-adlaire-filter-chip]");
    var root = chip ? chip.closest("[data-adlaire-filter]") : null;
    if (!root) {
      return;
    }

    root.querySelectorAll("[data-adlaire-filter-chip]").forEach(function (item) {
      item.setAttribute("aria-pressed", item === chip ? "true" : "false");
    });
    applyFilter(root);
  });
}());
