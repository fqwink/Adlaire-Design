/* Adlaire-Design WYSIWYG editor interactions */
(function () {
  "use strict";

  function editorRoot(element) {
    return element.closest(".adlaire-wysiwyg");
  }

  function setMode(root, mode) {
    root.setAttribute("data-adlaire-wysiwyg-mode", mode);
    root.querySelectorAll("[data-adlaire-wysiwyg-mode]").forEach(function (trigger) {
      trigger.setAttribute("aria-pressed", trigger.getAttribute("data-adlaire-wysiwyg-mode") === mode ? "true" : "false");
    });
  }

  function targetFor(trigger) {
    var selector = trigger.getAttribute("data-adlaire-wysiwyg-target");
    return selector ? document.querySelector(selector) : null;
  }

  document.addEventListener("click", function (event) {
    var modeTrigger = event.target.closest("[data-adlaire-wysiwyg-mode]");
    if (modeTrigger) {
      var root = editorRoot(modeTrigger);
      if (root) {
        setMode(root, modeTrigger.getAttribute("data-adlaire-wysiwyg-mode"));
      }
      return;
    }

    var toggle = event.target.closest("[data-adlaire-wysiwyg-toggle]");
    if (!toggle) {
      return;
    }

    var target = targetFor(toggle);
    if (!target) {
      return;
    }

    var open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    target.hidden = !open;
    target.classList.toggle("is-open", open);
  });
}());
