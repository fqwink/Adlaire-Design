/// <reference lib="dom" />
/* Adlaire-Design content interactions */
(() => {
  "use strict";

  function targetElement(target: EventTarget | null): Element | null {
    return target instanceof Element ? target : null;
  }

  function cellText(row: HTMLTableRowElement, index: number): string {
    const cell = row.children[index];
    return cell?.textContent?.trim() ?? "";
  }

  function compareRows(index: number, direction: string, type: string) {
    return (left: HTMLTableRowElement, right: HTMLTableRowElement): number => {
      const leftText = cellText(left, index);
      const rightText = cellText(right, index);
      const leftNumber = Number(leftText.replace(/,/g, ""));
      const rightNumber = Number(rightText.replace(/,/g, ""));
      const leftDate = Date.parse(leftText);
      const rightDate = Date.parse(rightText);
      const leftHasValue = leftText !== "";
      const rightHasValue = rightText !== "";
      let result: number;

      if (type === "number") {
        if (!leftHasValue && !rightHasValue) return 0;
        if (!leftHasValue || Number.isNaN(leftNumber)) return 1;
        if (!rightHasValue || Number.isNaN(rightNumber)) return -1;
        result = leftNumber - rightNumber;
      } else if (leftHasValue && rightHasValue && !Number.isNaN(leftNumber) && !Number.isNaN(rightNumber)) {
        result = leftNumber - rightNumber;
      } else if (type === "date") {
        if (!leftHasValue && !rightHasValue) return 0;
        if (!leftHasValue || Number.isNaN(leftDate)) return 1;
        if (!rightHasValue || Number.isNaN(rightDate)) return -1;
        result = leftDate - rightDate;
      } else if (leftHasValue && rightHasValue && !Number.isNaN(leftDate) && !Number.isNaN(rightDate)) {
        result = leftDate - rightDate;
      } else {
        result = leftText.localeCompare(rightText);
      }

      return direction === "desc" ? -result : result;
    };
  }

  document.addEventListener("click", (event) => {
    const header = targetElement(event.target)?.closest("[data-adlaire-sort]");
    if (!header) return;

    const columnHeader = header.closest("th") ?? header;
    const table = columnHeader.closest("table");
    const body = table?.tBodies[0] ?? null;
    if (!body || !columnHeader.parentElement) return;

    const headers = Array.from(columnHeader.parentElement.children);
    const index = headers.indexOf(columnHeader);
    const direction = columnHeader.getAttribute("aria-sort") === "ascending" ? "desc" : "asc";
    const type = header.getAttribute("data-adlaire-sort") ?? columnHeader.getAttribute("data-adlaire-sort") ?? "text";

    headers.forEach((item) => item.removeAttribute("aria-sort"));
    columnHeader.setAttribute("aria-sort", direction === "asc" ? "ascending" : "descending");
    Array.from(body.rows).sort(compareRows(index, direction, type)).forEach((row) => body.appendChild(row));
  });

  document.addEventListener("click", (event) => {
    const copy = targetElement(event.target)?.closest("[data-adlaire-code-copy]");
    if (!copy) return;

    const selector = copy.getAttribute("data-adlaire-code-copy");
    const target = selector ? document.querySelector(selector) : copy.closest(".adlaire-code-block");
    if (target && navigator.clipboard) {
      navigator.clipboard.writeText(target.textContent ?? "");
      copy.setAttribute("data-adlaire-copied", "true");
    }
  });

  document.addEventListener("click", (event) => {
    const line = targetElement(event.target)?.closest("[data-adlaire-code-line]");
    const viewer = line?.closest(".adlaire-git-code-view");
    if (!line || !viewer) return;

    viewer.querySelectorAll(".adlaire-git-line-highlight").forEach((item) => item.classList.remove("adlaire-git-line-highlight"));
    line.classList.add("adlaire-git-line-highlight");
  });
})();
