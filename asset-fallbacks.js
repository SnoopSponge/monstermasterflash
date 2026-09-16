/* Last-resort protection for damaged or unavailable user-imported artwork.
   All built-in artwork is included and checked by tests/regression.cjs. */
(() => {
  'use strict';
  document.addEventListener('error', event => {
    const img = event.target;
    if (!(img instanceof HTMLImageElement)) return;
    const fallback = img.dataset.fallback;
    if (fallback && !img.dataset.triedBase) {
      img.dataset.triedBase = 'true';
      img.src = `assets/${fallback}`;
      return;
    }
    if (img.dataset.missingArt) return;
    img.dataset.missingArt = 'true';
    img.classList.add('missing-art');
    img.src = 'assets/monster-unknown.svg';
  }, true);

})();
