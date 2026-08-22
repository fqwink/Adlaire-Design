/* Adlaire-Design content interactions */
(function () {
  "use strict";

  function cellText(row, index) {
    var cell = row.children[index];
    return cell ? cell.textContent.trim() : "";
  }

  function compareRows(index, direction) {
    return function (left, right) {
      var leftText = cellText(left, index);
      var rightText = cellText(right, index);
      var leftNumber = Number(leftText.replace(/,/g, ""));
      var rightNumber = Number(rightText.replace(/,/g, ""));
      var result;

      if (!Number.isNaN(leftNumber) && !Number.isNaN(rightNumber)) {
        result = leftNumber - rightNumber;
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

    var table = header.closest("table");
    var body = table ? table.tBodies[0] : null;
    if (!body) {
      return;
    }

    var headers = Array.prototype.slice.call(header.parentNode.children);
    var index = headers.indexOf(header);
    var direction = header.getAttribute("aria-sort") === "ascending" ? "desc" : "asc";

    headers.forEach(function (item) {
      item.removeAttribute("aria-sort");
    });

    header.setAttribute("aria-sort", direction === "asc" ? "ascending" : "descending");
    Array.prototype.slice.call(body.rows).sort(compareRows(index, direction)).forEach(function (row) {
      body.appendChild(row);
    });
  });
}());
