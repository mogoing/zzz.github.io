/* 愤怒小鸟加速 Service Worker：.wasm 请求改写为 .wasm.gz，gzip 解压后原样返回（传输量降 65%） */
self.addEventListener('install', function (e) { self.skipWaiting(); });
self.addEventListener('activate', function (e) { self.clients.claim(); });
self.addEventListener('fetch', function (e) {
  var url = new URL(e.request.url);
  if (url.pathname.indexOf('.wasm') > -1 && url.pathname.indexOf('.wasm.gz') === -1) {
    e.respondWith((async function () {
      try {
        var gzUrl = url.pathname + '.gz' + url.search;
        var resp = await fetch(gzUrl, { credentials: 'same-origin' });
        if (!resp.ok) throw 0;
        var buf = await resp.arrayBuffer();
        var ds = new DecompressionStream('gzip');
        var stream = new Blob([buf]).stream().pipeThrough(ds);
        var out = await new Response(stream).arrayBuffer();
        return new Response(out, {
          headers: {
            'Content-Type': 'application/wasm',
            'Content-Length': out.byteLength
          }
        });
      } catch (err) {
        /* gz 不可用时回退原始 wasm */
        return fetch(e.request);
      }
    })());
  }
});
