/// <reference lib="dom" />
/* Adlaire-Design WYSIWYG editor interactions */
(() => {
  "use strict";

  function targetElement(target: EventTarget | null): Element | null {
    return target instanceof Element ? target : null;
  }

  function editorRoot(element: Element): Element | null {
    return element.closest(".adlaire-wysiwyg");
  }

  function setMode(root: Element, mode: string): void {
    root.setAttribute("data-adlaire-wysiwyg-mode", mode);
    root.querySelectorAll("[data-adlaire-wysiwyg-mode]").forEach((trigger) => {
      trigger.setAttribute("aria-pressed", trigger.getAttribute("data-adlaire-wysiwyg-mode") === mode ? "true" : "false");
    });
  }

  function targetFor(trigger: Element): Element | null {
    const selector = trigger.getAttribute("data-adlaire-wysiwyg-target");
    return selector ? document.querySelector(selector) : null;
  }

  document.addEventListener("click", (event) => {
    const target = targetElement(event.target);
    const modeTrigger = target?.closest("[data-adlaire-wysiwyg-mode]");
    if (modeTrigger) {
      const root = editorRoot(modeTrigger);
      const mode = modeTrigger.getAttribute("data-adlaire-wysiwyg-mode");
      if (root && mode) setMode(root, mode);
      return;
    }

    const toggle = target?.closest("[data-adlaire-wysiwyg-toggle]");
    if (!toggle) return;

    const panel = targetFor(toggle);
    if (!panel) return;

    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    (panel as HTMLElement).hidden = !open;
    panel.classList.toggle("is-open", open);
  });

  document.addEventListener("click", (event) => {
    const selectable = targetElement(event.target)?.closest("[data-adlaire-wysiwyg-select]");
    if (!selectable) return;

    const root = editorRoot(selectable);
    if (!root) return;

    root.querySelectorAll(".adlaire-wysiwyg-block-selected, [data-adlaire-wysiwyg-select][aria-selected='true']").forEach((item) => {
      item.classList.remove("adlaire-wysiwyg-block-selected");
      item.setAttribute("aria-selected", "false");
    });
    selectable.classList.add("adlaire-wysiwyg-block-selected");
    selectable.setAttribute("aria-selected", "true");
  });
})();
