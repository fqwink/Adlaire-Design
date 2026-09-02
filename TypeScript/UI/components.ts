/// <reference lib="dom" />
/* Adlaire-Design component interactions */
(() => {
  "use strict";

  let lastFocus: HTMLElement | null = null;

  function targetElement(target: EventTarget | null): Element | null {
    return target instanceof Element ? target : null;
  }

  function getTarget(trigger: Element): HTMLElement | null {
    const selector = trigger.getAttribute("data-adlaire-target") ?? trigger.getAttribute("href");
    if (!selector || !selector.startsWith("#")) return null;
    return document.getElementById(selector.slice(1));
  }

  function setExpanded(trigger: Element, target: HTMLElement | null, expanded: boolean): void {
    trigger.setAttribute("aria-expanded", expanded ? "true" : "false");
    if (!target) return;
    target.hidden = !expanded;
    target.classList.toggle("is-open", expanded);
    if (expanded && target.matches(".adlaire-modal, .adlaire-drawer")) {
      document.documentElement.classList.add("adlaire-overlay-open");
    }
    if (!expanded && !document.querySelector(".adlaire-modal.is-open, .adlaire-drawer.is-open")) {
      document.documentElement.classList.remove("adlaire-overlay-open");
    }
  }

  function triggersForTarget(target: Element | null): Element[] {
    if (!target?.id) return [];
    const targetSelector = `#${target.id}`;
    const dataTriggers = Array.from(document.querySelectorAll("[data-adlaire-toggle][data-adlaire-target]"))
      .filter((trigger) => trigger.getAttribute("data-adlaire-target") === targetSelector);
    const hrefTriggers = Array.from(document.querySelectorAll("[data-adlaire-toggle][href]"))
      .filter((trigger) => trigger.getAttribute("href") === targetSelector);
    return dataTriggers.concat(hrefTriggers);
  }

  function getFocusable(target: Element): HTMLElement[] {
    return Array.from(target.querySelectorAll<HTMLElement>("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"))
      .filter((item) => !item.hidden && !item.hasAttribute("disabled") && item.getAttribute("aria-hidden") !== "true");
  }

  function focusFirst(target: Element): void {
    getFocusable(target)[0]?.focus();
  }

  function closeSiblings(trigger: Element, target: HTMLElement | null): void {
    const group = trigger.getAttribute("data-adlaire-group");
    if (!group) return;

    document.querySelectorAll("[data-adlaire-toggle][data-adlaire-group]").forEach((item) => {
      if (item.getAttribute("data-adlaire-group") !== group || item === trigger) return;
      setExpanded(item, getTarget(item), false);
    });

    if (target?.getAttribute("role") === "tabpanel") {
      document.querySelectorAll<HTMLElement>('[role="tabpanel"][data-adlaire-group]').forEach((panel) => {
        if (panel.getAttribute("data-adlaire-group") !== group || panel === target) return;
        panel.hidden = true;
        panel.classList.remove("is-open");
      });
    }
  }

  document.addEventListener("click", (event) => {
    const source = targetElement(event.target);
    const trigger = source?.closest("[data-adlaire-toggle]");
    const dismiss = source?.closest("[data-adlaire-dismiss]");
    const carouselControl = source?.closest("[data-adlaire-carousel-action]");
    let carouselIndicator = source?.closest("[data-adlaire-carousel-index]");
    if (carouselIndicator?.hasAttribute("data-adlaire-carousel")) carouselIndicator = null;

    if (dismiss) {
      const dismissTarget = getTarget(dismiss) ?? dismiss.closest<HTMLElement>(".adlaire-modal, .adlaire-drawer, .adlaire-dropdown-menu");
      if (dismissTarget) {
        dismissTarget.hidden = true;
        dismissTarget.classList.remove("is-open");
        triggersForTarget(dismissTarget).forEach((item) => item.setAttribute("aria-expanded", "false"));
      }
      if (!document.querySelector(".adlaire-modal.is-open, .adlaire-drawer.is-open")) {
        document.documentElement.classList.remove("adlaire-overlay-open");
      }
      lastFocus?.focus();
      return;
    }

    if (carouselControl || carouselIndicator) {
      event.preventDefault();
      moveCarousel(carouselControl ?? carouselIndicator ?? null);
      return;
    }

    if (!trigger) return;
    const target = getTarget(trigger);
    if (!target) return;

    event.preventDefault();
    const isExpanded = trigger.getAttribute("aria-expanded") === "true";
    lastFocus = trigger instanceof HTMLElement ? trigger : null;
    closeSiblings(trigger, target);
    setExpanded(trigger, target, !isExpanded);
    if (!isExpanded && target.matches(".adlaire-modal, .adlaire-drawer")) focusFirst(target);
  });

  document.addEventListener("keydown", (event) => {
    const activeOverlay = document.querySelector<HTMLElement>(".adlaire-modal.is-open, .adlaire-drawer.is-open");
    if (event.key === "Tab" && activeOverlay) {
      containFocus(event, activeOverlay);
      return;
    }
    if (event.key !== "Escape") return;

    document.querySelectorAll<HTMLElement>(".adlaire-modal.is-open, .adlaire-drawer.is-open, .adlaire-dropdown-menu.is-open").forEach((target) => {
      target.hidden = true;
      target.classList.remove("is-open");
      triggersForTarget(target).forEach((trigger) => trigger.setAttribute("aria-expanded", "false"));
    });
    document.documentElement.classList.remove("adlaire-overlay-open");
    lastFocus?.focus();
  });

  function containFocus(event: KeyboardEvent, target: Element): void {
    const focusable = getFocusable(target);
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!target.contains(document.activeElement)) {
      event.preventDefault();
      first.focus();
    } else if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function moveCarousel(control: Element | null): void {
    const root = control?.closest<HTMLElement>("[data-adlaire-carousel]");
    if (!root) return;

    const track = root.querySelector<HTMLElement>(".adlaire-carousel-track");
    const slides = Array.from(root.querySelectorAll<HTMLElement>(".adlaire-carousel-slide"));
    if (!track || slides.length === 0) return;

    let current = Number(root.getAttribute("data-adlaire-carousel-index") || "0");
    const requested = control?.getAttribute("data-adlaire-carousel-index");
    const action = control?.getAttribute("data-adlaire-carousel-action");
    let next = requested !== null && requested !== undefined ? Number(requested) : current + (action === "previous" ? -1 : 1);
    if (!Number.isFinite(next)) next = 0;
    if (next < 0) next = slides.length - 1;
    if (next >= slides.length) next = 0;
    current = next;

    root.setAttribute("data-adlaire-carousel-index", String(current));
    track.style.transform = `translateX(-${current * 100}%)`;
    slides.forEach((slide, index) => {
      const currentSlide = index === current;
      slide.classList.toggle("is-current", currentSlide);
      slide.setAttribute("aria-hidden", currentSlide ? "false" : "true");
    });
    Array.from(root.querySelectorAll("[data-adlaire-carousel-index]"))
      .filter((indicator) => !indicator.hasAttribute("data-adlaire-carousel"))
      .forEach((indicator, index) => indicator.setAttribute("aria-current", index === current ? "true" : "false"));
  }

  document.addEventListener("click", (event) => {
    const source = targetElement(event.target);
    const copy = source?.closest("[data-adlaire-copy]");
    const remove = source?.closest("[data-adlaire-remove]");
    const select = source?.closest("[data-adlaire-select]");

    if (copy) {
      const copyTarget = getTarget(copy);
      const text = copyTarget?.textContent ?? copy.getAttribute("data-adlaire-copy");
      if (text && navigator.clipboard) {
        navigator.clipboard.writeText(text);
        copy.setAttribute("data-adlaire-copied", "true");
      }
    }

    if (remove) {
      const removable = getTarget(remove) ?? remove.closest(".adlaire-toast, .adlaire-snackbar, .adlaire-upload-item, .adlaire-attachment-item");
      removable?.remove();
    }

    if (select) {
      const list = select.closest("[data-adlaire-select-list]");
      list?.querySelectorAll("[data-adlaire-select]").forEach((item) => {
        item.setAttribute("aria-selected", item === select ? "true" : "false");
      });
    }
  });

  document.addEventListener("input", (event) => {
    const source = targetElement(event.target);
    const filter = source?.closest<HTMLInputElement>("[data-adlaire-filter-input]");
    const search = source?.closest<HTMLInputElement>("[data-adlaire-search-input]");
    if (filter) applyTextFilter(filter);
    if (search) applyTextFilter(search);
  });

  function applyTextFilter(input: HTMLInputElement): void {
    const selector = input.getAttribute("data-adlaire-filter-root") ?? input.getAttribute("data-adlaire-search-root");
    const root = selector ? document.querySelector(selector) : null;
    const itemSelector = input.getAttribute("data-adlaire-filter-item") ?? input.getAttribute("data-adlaire-search-item");
    if (!root || !itemSelector) return;

    const query = input.value.trim().toLowerCase();
    root.querySelectorAll<HTMLElement>(itemSelector).forEach((item) => {
      const matched = (item.textContent ?? "").toLowerCase().includes(query);
      item.hidden = !matched;
    });
  }

  document.querySelectorAll<HTMLElement>("[data-adlaire-split-pane]").forEach((root) => {
    const handle = root.querySelector<HTMLElement>(".adlaire-pane-resize-handle");
    const panes = root.querySelectorAll(".adlaire-pane");
    if (!handle || panes.length < 2) return;
    handle.addEventListener("keydown", (event) => {
      let current = Number(root.getAttribute("data-adlaire-pane-ratio") || "50");
      if (event.key === "ArrowLeft") {
        current = Math.max(20, current - 5);
      } else if (event.key === "ArrowRight") {
        current = Math.min(80, current + 5);
      } else {
        return;
      }
      event.preventDefault();
      root.setAttribute("data-adlaire-pane-ratio", String(current));
      root.style.gridTemplateColumns = `${current}% 8px 1fr`;
    });
  });
})();
