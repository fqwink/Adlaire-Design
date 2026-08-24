/* Adlaire-Design form interactions */
(function () {
  "use strict";

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function applyFilter(root) {
    var queryInput = root.querySelector("[data-adlaire-filter-input]");
    var activeChip = root.querySelector("[data-adlaire-filter-chip][aria-pressed='true']");
    var count = root.querySelector("[data-adlaire-filter-count]");
    var empty = root.querySelector("[data-adlaire-filter-empty]");
    var query = normalize(queryInput ? queryInput.value : "");
    var filter = normalize(activeChip ? activeChip.getAttribute("data-adlaire-filter-chip") : "");
    if (filter === "all") {
      filter = "";
    }
    var visibleCount = 0;

    root.querySelectorAll("[data-adlaire-filter-item]").forEach(function (item) {
      var text = normalize(item.textContent);
      var group = normalize(item.getAttribute("data-adlaire-filter-item"));
      var groups = group ? group.split(/\s+/) : [];
      var matchesQuery = !query || text.indexOf(query) !== -1;
      var matchesFilter = !filter || groups.indexOf(filter) !== -1;
      var visible = matchesQuery && matchesFilter;
      item.hidden = !visible;
      if (visible) {
        visibleCount += 1;
      }
    });

    if (count) {
      count.textContent = String(visibleCount);
    }
    if (empty) {
      empty.hidden = visibleCount !== 0;
      empty.classList.toggle("is-open", visibleCount === 0);
    }
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

  document.addEventListener("change", function (event) {
    var fileInput = event.target.closest("[data-adlaire-file-input]");
    var toggleInput = event.target.closest("[data-adlaire-toggle-input]");

    if (fileInput) {
      var output = document.querySelector(fileInput.getAttribute("data-adlaire-file-output"));
      if (output) {
        output.textContent = Array.prototype.map.call(fileInput.files || [], function (file) {
          return file.name;
        }).join(", ");
      }
    }

    if (toggleInput) {
      var toggle = document.querySelector(toggleInput.getAttribute("data-adlaire-toggle-input"));
      if (toggle) {
        toggle.setAttribute("aria-checked", toggleInput.checked ? "true" : "false");
      }
    }
  });

  document.addEventListener("input", function (event) {
    var field = event.target.closest("[data-adlaire-validate]");
    if (!field) {
      return;
    }

    var wrapper = field.closest(".adlaire-field");
    if (!wrapper) {
      return;
    }

    var invalid = field.hasAttribute("required") && normalize(field.value) === "";
    field.setAttribute("aria-invalid", invalid ? "true" : "false");
    wrapper.classList.toggle("adlaire-field-error", invalid);
    wrapper.classList.toggle("adlaire-field-success", !invalid);
  });
}());
