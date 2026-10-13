/* H5 (mobile) refinements — layered on top of the original site.
   Plain script (not a module) so it runs even before the WebGL
   bundle finishes loading. Never throws: adapters must not break
   the page. */
(function () {
  try {
    if (!window.matchMedia || !matchMedia('(pointer: coarse)').matches) return;

    var swap = { Scroll: 'Swipe', Click: 'Tap' };

    function adapt() {
      var kbd = document.querySelectorAll('.sc-hints kbd');
      for (var i = 0; i < kbd.length; i++) {
        var t = (kbd[i].textContent || '').trim();
        if (swap[t]) kbd[i].textContent = swap[t];
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', adapt);
    } else {
      adapt();
    }
  } catch (e) { /* adapter failures must never break the page */ }
})();
