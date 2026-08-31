/* Adlaire-Design sample interactions */

(function () {
  var root = document.documentElement;
  root.classList.add('adlaire-sample-ready');

  var icons = document.querySelectorAll('.adlaire-icon-tile img');
  icons.forEach(function (icon) {
    icon.loading = 'lazy';
  });

  var count = document.querySelector('[data-adlaire-filter-count]');
  if (count) {
    count.textContent = String(document.querySelectorAll('.adlaire-language-option').length);
  }
})();
