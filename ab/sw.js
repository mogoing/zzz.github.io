/* 愤怒小鸟加速 Service Worker v51
 * 1) 持久缓存：ab/ 下所有资源（ruffle/core/swf/wasm.gz）存进 CacheStorage，
 *    之后每次打开直接从缓存返回，零网络、永不过期、APK 重启也秒开。
 * 2) 字节校验：写入前校验 byteLength，坏缓存/断流缓存直接删除重下（cache:reload 绕过 HTTP 坏缓存）。
 * 3) wasm 走 gz：拦截 .wasm 请求 → 缓存/下载 .wasm.gz → 解压返回（传输量降 65%）。
 * 4) 版本更新：CACHE 名改为 v{N} 即整体刷新缓存（清掉旧坏缓存）。
 */
var CACHE = 'ab-v51';
var GZ_WASM = ['72a20ef1c0b8ceb37720.wasm', '826bb0938097485a2c9d.wasm'];
var GZ_SIZE = { '72a20ef1c0b8ceb37720.wasm.gz': 4976993, '826bb0938097485a2c9d.wasm.gz': 4984326 };
var FILE_SIZE = {
  'ruffle.js': 465076,
  'core.ruffle.c80159b526e567babaf5.js': 108322,
  'core.ruffle.f000070ea72f8ae4fe3a.js': 114739,
  'angry_birds.swf': 7122218,
  'cursed-treasure-1.swf': 7987921,
  'skisafari.swf': 10319667
};

self.addEventListener('install', function (e) { self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (ks) {
      return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { self.clients.claim(); })
  );
});

function gz2wasm(buf) {
  if (typeof DecompressionStream === 'undefined') throw new Error('no-decompression');
  return new Response(new Blob([buf]).stream().pipeThrough(new DecompressionStream('gzip')), {
    headers: { 'Content-Type': 'application/wasm' }
  });
}

self.addEventListener('fetch', function (e) {
  var url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  var p = url.pathname;
  var isRawWasm = p.indexOf('.wasm') > -1 && p.indexOf('.wasm.gz') === -1;
  var isGzTarget = GZ_WASM.some(function (w) { return p.indexOf(w) > -1; });

  /* Ruffle 请求原始 .wasm → 走 gz 缓存/下载 + 解压 */
  if (isRawWasm && isGzTarget) {
    e.respondWith((async function () {
      var gzName = p + '.gz';
      var gzFile = gzName.split('/').pop();
      var size = GZ_SIZE[gzFile];
      try {
        var cache = await caches.open(CACHE);
        var hit = await cache.match(gzName);
        if (hit) {
          var buf = await hit.arrayBuffer();
          if (!size || buf.byteLength === size) return gz2wasm(buf);
          await cache.delete(gzName);                    /* 坏 gz 缓存：删除 */
        }
        for (var t = 0; t < 2; t++) {                    /* 绕过 HTTP 缓存重下，最多 2 次 */
          var resp = await fetch(gzName, { cache: 'reload' });
          if (!resp.ok) continue;
          var b = await resp.arrayBuffer();
          if (!size || b.byteLength === size) {
            try { await cache.put(gzName, new Response(b, { headers: { 'Content-Type': 'application/gzip' } })); } catch (err) {}
            return gz2wasm(b);
          }
        }
        return new Response('bad gz', { status: 502 });  /* 下载失败：让 Ruffle 报错，用户点重试 */
      } catch (err) {
        return fetch(e.request);                          /* 不支持解压等：回退原始 wasm（远端存在） */
      }
    })());
    return;
  }

  /* ab/ 下 js / swf / gz：缓存优先，写入前字节校验 */
  if (p.indexOf('/ab/') === 0 && (/\.(js|swf)$/.test(p) || p.indexOf('.wasm.gz') > -1)) {
    e.respondWith((async function () {
      var cache = await caches.open(CACHE);
      var hit = await cache.match(e.request);
      if (hit) return hit;
      var name = p.split('/').pop();
      var size = FILE_SIZE[name];
      var resp = await fetch(e.request);                  /* 默认：命中 HTTP 缓存/预下载 */
      if (resp && resp.ok) {
        if (size) {
          var arr = await resp.clone().arrayBuffer();
          if (arr.byteLength === size) {
            try { await cache.put(e.request, resp.clone()); } catch (err) {}
          } else {
            try { await cache.delete(e.request); } catch (err) {}
            var resp2 = await fetch(e.request, { cache: 'reload' });   /* 坏缓存：绕过重下 */
            if (resp2 && resp2.ok) {
              var arr2 = await resp2.clone().arrayBuffer();
              if (arr2.byteLength === size) { try { await cache.put(e.request, resp2.clone()); } catch (err) {} }
            }
            return resp2;
          }
        } else {
          try { await cache.put(e.request, resp.clone()); } catch (err) {}
        }
      }
      return resp;
    })());
  }
});
