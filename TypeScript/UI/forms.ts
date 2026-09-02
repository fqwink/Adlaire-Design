/// <reference lib="dom" />
/* Adlaire-Design form interactions */
(() => {
  "use strict";

  function targetElement(target: EventTarget | null): Element | null {
    return target instanceof Element ? target : null;
  }

  function normalize(value: unknown): string {
    return String(value || "").trim().toLowerCase();
  }

  function applyFilter(root: Element): void {
    const queryInput = root.querySelector<HTMLInputElement>("[data-adlaire-filter-input]");
    const activeChip = root.querySelector("[data-adlaire-filter-chip][aria-pressed='true']");
    const count = root.querySelector("[data-adlaire-filter-count]");
    const empty = root.querySelector<HTMLElement>("[data-adlaire-filter-empty]");
    const query = normalize(queryInput?.value ?? "");
    let filter = normalize(activeChip?.getAttribute("data-adlaire-filter-chip") ?? "");
    if (filter === "all") filter = "";
    let visibleCount = 0;

    root.querySelectorAll<HTMLElement>("[data-adlaire-filter-item]").forEach((item) => {
      const text = normalize(item.textContent);
      const group = normalize(item.getAttribute("data-adlaire-filter-item"));
      const groups = group ? group.split(/\s+/) : [];
      const visible = (!query || text.includes(query)) && (!filter || groups.includes(filter));
      item.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    if (count) count.textContent = String(visibleCount);
    if (empty) {
      empty.hidden = visibleCount !== 0;
      empty.classList.toggle("is-open", visibleCount === 0);
    }
  }

  document.addEventListener("input", (event) => {
    const input = targetElement(event.target)?.closest("[data-adlaire-filter-input]");
    const root = input?.closest("[data-adlaire-filter]");
    if (root) applyFilter(root);
  });

  document.addEventListener("click", (event) => {
    const chip = targetElement(event.target)?.closest("[data-adlaire-filter-chip]");
    const root = chip?.closest("[data-adlaire-filter]");
    if (!chip || !root) return;

    root.querySelectorAll("[data-adlaire-filter-chip]").forEach((item) => {
      item.setAttribute("aria-pressed", item === chip ? "true" : "false");
    });
    applyFilter(root);
  });

  document.addEventListener("change", (event) => {
    const target = targetElement(event.target);
    const fileInput = target?.closest<HTMLInputElement>("[data-adlaire-file-input]");
    const toggleInput = target?.closest<HTMLInputElement>("[data-adlaire-toggle-input]");

    if (fileInput) {
      const selector = fileInput.getAttribute("data-adlaire-file-output");
      const output = selector ? document.querySelector(selector) : null;
      if (output) output.textContent = Array.from(fileInput.files ?? []).map((file) => file.name).join(", ");
    }

    if (toggleInput) {
      const selector = toggleInput.getAttribute("data-adlaire-toggle-input");
      const toggle = selector ? document.querySelector(selector) : null;
      if (toggle) toggle.setAttribute("aria-checked", toggleInput.checked ? "true" : "false");
    }
  });

  document.addEventListener("input", (event) => {
    const field = targetElement(event.target)?.closest<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>("[data-adlaire-validate]");
    const wrapper = field?.closest(".adlaire-field");
    if (!field || !wrapper) return;

    const invalid = field.hasAttribute("required") && normalize(field.value) === "";
    field.setAttribute("aria-invalid", invalid ? "true" : "false");
    wrapper.classList.toggle("adlaire-field-error", invalid);
    wrapper.classList.toggle("adlaire-field-success", !invalid);
  });
})();
