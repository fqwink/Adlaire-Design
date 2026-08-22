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
    }
  }

  function closeSiblings(trigger, target) {
    var group = trigger.getAttribute("data-adlaire-group");
    if (!group) {
      return;
    }

    document.querySelectorAll('[data-adlaire-group="' + group + '"]').forEach(function (item) {
      if (item === trigger) {
        return;
      }
      setExpanded(item, getTarget(item), false);
    });

    if (target && target.getAttribute("role") === "tabpanel") {
      document.querySelectorAll('[role="tabpanel"][data-adlaire-group="' + group + '"]').forEach(function (panel) {
        if (panel !== target) {
          panel.hidden = true;
          panel.classList.remove("is-open");
        }
      });
    }
  }

  document.addEventListener("click", function (event) {
    var trigger = event.target.closest("[data-adlaire-toggle]");
    if (!trigger) {
      return;
    }

    var target = getTarget(trigger);
    if (!target) {
      return;
    }

    event.preventDefault();
    var isExpanded = trigger.getAttribute("aria-expanded") === "true";
    closeSiblings(trigger, target);
    setExpanded(trigger, target, !isExpanded);
  });
}());
