/* Adlaire-Design content interactions */
(function () {
  "use strict";

  function cellText(row, index) {
    var cell = row.children[index];
    return cell ? cell.textContent.trim() : "";
  }

  function compareRows(index, direction, type) {
    return function (left, right) {
      var leftText = cellText(left, index);
      var rightText = cellText(right, index);
      var leftNumber = Number(leftText.replace(/,/g, ""));
      var rightNumber = Number(rightText.replace(/,/g, ""));
      var leftDate = Date.parse(leftText);
      var rightDate = Date.parse(rightText);
      var leftHasValue = leftText !== "";
      var rightHasValue = rightText !== "";
      var result;

      if (type === "number") {
        if (!leftHasValue && !rightHasValue) {
          return 0;
        }
        if (!leftHasValue || Number.isNaN(leftNumber)) {
          return 1;
        }
        if (!rightHasValue || Number.isNaN(rightNumber)) {
          return -1;
        }
        result = leftNumber - rightNumber;
      } else if (leftHasValue && rightHasValue && !Number.isNaN(leftNumber) && !Number.isNaN(rightNumber)) {
        result = leftNumber - rightNumber;
      } else if (type === "date") {
        if (!leftHasValue && !rightHasValue) {
          return 0;
        }
        if (!leftHasValue || Number.isNaN(leftDate)) {
          return 1;
        }
        if (!rightHasValue || Number.isNaN(rightDate)) {
          return -1;
        }
        result = leftDate - rightDate;
      } else if (leftHasValue && rightHasValue && !Number.isNaN(leftDate) && !Number.isNaN(rightDate)) {
        result = leftDate - rightDate;
      } else {
        result = leftText.localeCompare(rightText);
      }

      return direction === "desc" ? -result : result;
    };
  }

  document.addEventListener("click", function (event) {
    var header = event.target.closest("[data-adlaire-sort]");
    if (!header) {
      return;
    }

    var columnHeader = header.closest("th") || header;
    var table = columnHeader.closest("table");
    var body = table ? table.tBodies[0] : null;
    if (!body) {
      return;
    }

    var headers = Array.prototype.slice.call(columnHeader.parentNode.children);
    var index = headers.indexOf(columnHeader);
    var direction = columnHeader.getAttribute("aria-sort") === "ascending" ? "desc" : "asc";
    var type = header.getAttribute("data-adlaire-sort") || columnHeader.getAttribute("data-adlaire-sort") || "text";

    headers.forEach(function (item) {
      item.removeAttribute("aria-sort");
    });

    columnHeader.setAttribute("aria-sort", direction === "asc" ? "ascending" : "descending");
    Array.prototype.slice.call(body.rows).sort(compareRows(index, direction, type)).forEach(function (row) {
      body.appendChild(row);
    });
  });

  document.addEventListener("click", function (event) {
    var copy = event.target.closest("[data-adlaire-code-copy]");
    if (!copy) {
      return;
    }

    var selector = copy.getAttribute("data-adlaire-code-copy");
    var target = selector ? document.querySelector(selector) : copy.closest(".adlaire-code-block");
    if (target && navigator.clipboard) {
      navigator.clipboard.writeText(target.textContent);
      copy.setAttribute("data-adlaire-copied", "true");
    }
  });

  document.addEventListener("click", function (event) {
    var line = event.target.closest("[data-adlaire-code-line]");
    if (!line) {
      return;
    }

    var viewer = line.closest(".adlaire-git-code-view");
    if (!viewer) {
      return;
    }

    viewer.querySelectorAll(".adlaire-git-line-highlight").forEach(function (item) {
      item.classList.remove("adlaire-git-line-highlight");
    });
    line.classList.add("adlaire-git-line-highlight");
  });
}());
