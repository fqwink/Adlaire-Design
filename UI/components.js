/* Adlaire-Design component interactions */
(function () {
  "use strict";

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

    return Array.prototype.filter.call(document.querySelectorAll("[data-adlaire-target]"), function (trigger) {
      return trigger.getAttribute("data-adlaire-target") === "#" + target.id;
    });
  }

  function closeSiblings(trigger, target) {
    var group = trigger.getAttribute("data-adlaire-group");
    if (!group) {
      return;
    }

    document.querySelectorAll("[data-adlaire-group]").forEach(function (item) {
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
      closeSiblings(trigger, target);
      setExpanded(trigger, target, !isExpanded);
    }
  });

  document.addEventListener("keydown", function (event) {
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
  });

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

    if (next < 0) {
      next = slides.length - 1;
    }
    if (next >= slides.length) {
      next = 0;
    }

    root.setAttribute("data-adlaire-carousel-index", String(next));
    track.style.transform = "translateX(-" + (next * 100) + "%)";
    slides.forEach(function (slide, index) {
      slide.hidden = index !== next;
      slide.setAttribute("aria-hidden", index === next ? "false" : "true");
    });
    Array.prototype.filter.call(root.querySelectorAll("[data-adlaire-carousel-index]"), function (indicator) {
      return !indicator.hasAttribute("data-adlaire-carousel");
    }).forEach(function (indicator, index) {
      indicator.setAttribute("aria-current", index === next ? "true" : "false");
    });
  }
}());
