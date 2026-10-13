  // Loader watchdog: surface failures (CDN unreachable, no WebGL, script error) instead of an endless loading screen.
  (function () {
    var shown = false;
    function fail(msg) { if (shown || window.__emReady) return; shown = true; var s = document.getElementById('ld-status'); if (s) { s.style.color = '#ff8a8a'; s.textContent = msg; } }
    addEventListener('error', function (e) { fail('SYSTEM FAULT · ' + (e.message || 'script error')); });
    addEventListener('unhandledrejection', function (e) { fail('SYSTEM FAULT · ' + (e.reason && e.reason.message || e.reason)); });
    if (location.protocol === 'file:') {
      // Advisory for plain double-click. Prove first whether the browser still
      // blocks local file reads: "1-直接打开.bat" launches it with
      // --allow-file-access-from-files, the probe succeeds and no scary
      // red message is shown. (H5 adaptation, mirrors otherwise unchanged.)
      var fileBlocked = true;
      try { fetch('js/boot.js').then(function () { fileBlocked = false; }, function () {}); } catch (e) {}
      addEventListener('DOMContentLoaded', function () { if (fileBlocked) fail('OPEN VIA A LOCAL SERVER · file:// is blocked — double-click 1-直接打开.bat, or run serve.py and open http://localhost:8080'); });
    }
    setTimeout(function () { var s = document.getElementById('ld-status'); if (!window.__emStarted && !shown && s) s.textContent = 'STILL LOADING · if this persists, serve the folder over HTTP (python3 serve.py) instead of opening the file directly'; }, 20000);
  })();
