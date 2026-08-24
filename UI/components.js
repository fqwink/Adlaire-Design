/* Adlaire-Design component interactions */
(function () {
  "use strict";

  var lastFocus = null;

  function getTarget(trigger) {
    var selector = trigger.getAttribute("data-adlaire-target") || trigger.getAttribute("href");
    if (!selector || selector.charAt(0) !== "#") {
      return null;
    }
    return document.getElementById(selector.slice(1));
  }

  function setExpanded(trigger, target, expanded) {
    trigger.setAttribute("aria-expanded", expanded ? "true" : "false");
    if (target) {
      target.hidden = !expanded;
      target.classList.toggle("is-open", expanded);
      if (expanded && target.matches(".adlaire-modal, .adlaire-drawer")) {
        document.documentElement.classList.add("adlaire-overlay-open");
      }
      if (!expanded && !document.querySelector(".adlaire-modal.is-open, .adlaire-drawer.is-open")) {
        document.documentElement.classList.remove("adlaire-overlay-open");
      }
    }
  }

  function triggersForTarget(target) {
    if (!target || !target.id) {
      return [];
    }

    return Array.prototype.filter.call(document.querySelectorAll("[data-adlaire-toggle][data-adlaire-target]"), function (trigger) {
      return trigger.getAttribute("data-adlaire-target") === "#" + target.id;
    }).concat(Array.prototype.filter.call(document.querySelectorAll("[data-adlaire-toggle][href]"), function (trigger) {
      return trigger.getAttribute("href") === "#" + target.id;
    }));
  }

  function getFocusable(target) {
    return Array.prototype.filter.call(target.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"), function (item) {
      return !item.hidden && !item.disabled && item.getAttribute("aria-hidden") !== "true";
    });
  }

  function focusFirst(target) {
    var focusable = getFocusable(target)[0];
    if (focusable) {
      focusable.focus();
    }
  }

  function closeSiblings(trigger, target) {
    var group = trigger.getAttribute("data-adlaire-group");
    if (!group) {
      return;
    }

    document.querySelectorAll("[data-adlaire-toggle][data-adlaire-group]").forEach(function (item) {
      if (item.getAttribute("data-adlaire-group") !== group) {
        return;
      }
      if (item === trigger) {
        return;
      }
      setExpanded(item, getTarget(item), false);
    });

    if (target && target.getAttribute("role") === "tabpanel") {
      document.querySelectorAll('[role="tabpanel"][data-adlaire-group]').forEach(function (panel) {
        if (panel.getAttribute("data-adlaire-group") !== group) {
          return;
        }
        if (panel !== target) {
          panel.hidden = true;
          panel.classList.remove("is-open");
        }
      });
    }
  }

  document.addEventListener("click", function (event) {
    var trigger = event.target.closest("[data-adlaire-toggle]");
    var dismiss = event.target.closest("[data-adlaire-dismiss]");
    var carouselControl = event.target.closest("[data-adlaire-carousel-action]");
    var carouselIndicator = event.target.closest("[data-adlaire-carousel-index]");
    if (carouselIndicator && carouselIndicator.hasAttribute("data-adlaire-carousel")) {
      carouselIndicator = null;
    }

    if (dismiss) {
      var dismissTarget = getTarget(dismiss) || dismiss.closest(".adlaire-modal, .adlaire-drawer, .adlaire-dropdown-menu");
      if (dismissTarget) {
        dismissTarget.hidden = true;
        dismissTarget.classList.remove("is-open");
        triggersForTarget(dismissTarget).forEach(function (item) {
          item.setAttribute("aria-expanded", "false");
        });
      }
      if (!document.querySelector(".adlaire-modal.is-open, .adlaire-drawer.is-open")) {
        document.documentElement.classList.remove("adlaire-overlay-open");
      }
      if (lastFocus && typeof lastFocus.focus === "function") {
        lastFocus.focus();
      }
      return;
    }

    if (carouselControl || carouselIndicator) {
      event.preventDefault();
      moveCarousel(carouselControl || carouselIndicator);
      return;
    }

    if (trigger) {
      var target = getTarget(trigger);
      if (!target) {
        return;
      }

      event.preventDefault();
      var isExpanded = trigger.getAttribute("aria-expanded") === "true";
      lastFocus = trigger;
      closeSiblings(trigger, target);
      setExpanded(trigger, target, !isExpanded);
      if (!isExpanded && target.matches(".adlaire-modal, .adlaire-drawer")) {
        focusFirst(target);
      }
    }
  });

  document.addEventListener("keydown", function (event) {
    var activeOverlay = document.querySelector(".adlaire-modal.is-open, .adlaire-drawer.is-open");
    if (event.key === "Tab" && activeOverlay) {
      containFocus(event, activeOverlay);
      return;
    }

    if (event.key !== "Escape") {
      return;
    }

    document.querySelectorAll(".adlaire-modal.is-open, .adlaire-drawer.is-open, .adlaire-dropdown-menu.is-open").forEach(function (target) {
      target.hidden = true;
      target.classList.remove("is-open");
      triggersForTarget(target).forEach(function (trigger) {
        trigger.setAttribute("aria-expanded", "false");
      });
    });
    document.documentElement.classList.remove("adlaire-overlay-open");
    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
  });

  function containFocus(event, target) {
    var focusable = getFocusable(target);
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }

    var first = focusable[0];
    var last = focusable[focusable.length - 1];
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

  function moveCarousel(control) {
    var root = control.closest("[data-adlaire-carousel]");
    if (!root) {
      return;
    }

    var track = root.querySelector(".adlaire-carousel-track");
    var slides = Array.prototype.slice.call(root.querySelectorAll(".adlaire-carousel-slide"));
    if (!track || slides.length === 0) {
      return;
    }

    var current = Number(root.getAttribute("data-adlaire-carousel-index") || "0");
    var requested = control.getAttribute("data-adlaire-carousel-index");
    var action = control.getAttribute("data-adlaire-carousel-action");
    var next = requested !== null ? Number(requested) : current + (action === "previous" ? -1 : 1);
    if (!Number.isFinite(next)) {
      next = 0;
    }

    if (next < 0) {
      next = slides.length - 1;
    }
    if (next >= slides.length) {
      next = 0;
    }

    root.setAttribute("data-adlaire-carousel-index", String(next));
    track.style.transform = "translateX(-" + (next * 100) + "%)";
    slides.forEach(function (slide, index) {
      var currentSlide = index === next;
      slide.classList.toggle("is-current", currentSlide);
      slide.setAttribute("aria-hidden", currentSlide ? "false" : "true");
    });
    Array.prototype.filter.call(root.querySelectorAll("[data-adlaire-carousel-index]"), function (indicator) {
      return !indicator.hasAttribute("data-adlaire-carousel");
    }).forEach(function (indicator, index) {
      indicator.setAttribute("aria-current", index === next ? "true" : "false");
    });
  }

  document.addEventListener("click", function (event) {
    var copy = event.target.closest("[data-adlaire-copy]");
    var remove = event.target.closest("[data-adlaire-remove]");
    var select = event.target.closest("[data-adlaire-select]");

    if (copy) {
      var copyTarget = getTarget(copy);
      var text = copyTarget ? copyTarget.textContent : copy.getAttribute("data-adlaire-copy");
      if (text && navigator.clipboard) {
        navigator.clipboard.writeText(text);
        copy.setAttribute("data-adlaire-copied", "true");
      }
    }

    if (remove) {
      var removable = getTarget(remove) || remove.closest(".adlaire-toast, .adlaire-snackbar, .adlaire-upload-item, .adlaire-attachment-item");
      if (removable) {
        removable.remove();
      }
    }

    if (select) {
      var list = select.closest("[data-adlaire-select-list]");
      if (list) {
        list.querySelectorAll("[data-adlaire-select]").forEach(function (item) {
          item.setAttribute("aria-selected", item === select ? "true" : "false");
        });
      }
    }
  });

  document.addEventListener("input", function (event) {
    var filter = event.target.closest("[data-adlaire-filter-input]");
    var search = event.target.closest("[data-adlaire-search-input]");
    if (filter) {
      applyTextFilter(filter);
    }
    if (search) {
      applyTextFilter(search);
    }
  });

  function applyTextFilter(input) {
    var root = document.querySelector(input.getAttribute("data-adlaire-filter-root") || input.getAttribute("data-adlaire-search-root"));
    var itemSelector = input.getAttribute("data-adlaire-filter-item") || input.getAttribute("data-adlaire-search-item");
    if (!root || !itemSelector) {
      return;
    }

    var query = input.value.trim().toLowerCase();
    root.querySelectorAll(itemSelector).forEach(function (item) {
      var matched = item.textContent.toLowerCase().indexOf(query) !== -1;
      item.hidden = !matched;
    });
  }

  document.querySelectorAll("[data-adlaire-split-pane]").forEach(function (root) {
    var handle = root.querySelector(".adlaire-pane-resize-handle");
    var panes = root.querySelectorAll(".adlaire-pane");
    if (!handle || panes.length < 2) {
      return;
    }
    handle.addEventListener("keydown", function (event) {
      var current = Number(root.getAttribute("data-adlaire-pane-ratio") || "50");
      if (event.key === "ArrowLeft") {
        current = Math.max(20, current - 5);
      } else if (event.key === "ArrowRight") {
        current = Math.min(80, current + 5);
      } else {
        return;
      }
      event.preventDefault();
      root.setAttribute("data-adlaire-pane-ratio", String(current));
      root.style.gridTemplateColumns = current + "% 8px 1fr";
    });
  });
}());
