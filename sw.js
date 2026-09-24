/* Service Worker：游戏资源预缓存 + 运行时网络优先
 * - 首次进入：后台静默下载 pvz 全部资源（不阻塞页面）
 * - 二次访问：优先走网络保证最新，慢网/离线回退缓存
 */
importScripts('pvz_manifest.js');

const CACHE = 'game-cache-v4';

// 启动即缓存的核心文件（必须全部存在，否则 addAll 会失败）
const CORE = [
  './',
  './index.html',
  './main.html',
  './pvz.html',
  './eatsnake.html',
  './lian.html',
  './xiao.html',
  './pvz/plantsvszombies.htm',
  './pvz/g.css'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(CORE))
      .then(() => self.skipWaiting())
      .catch(err => console.warn('核心预缓存部分失败:', err))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    // 清理旧版本缓存，避免脏数据长期占用
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
      .then(() => {
        // 激活 2 秒后开始后台预下载 pvz 全部资源
        setTimeout(() => precacheAll(), 2000);
      })
  );
});

// ===== 后台预下载 pvz 全部资源 =====
let precaching = false;
async function precacheAll() {
  if (precaching) return;
  precaching = true;
  const cache = await caches.open(CACHE);
  const total = PVZ_FILES.length;
  let done = 0;
  const BATCH = 4; // 每批并发数

  for (let i = 0; i < total; i += BATCH) {
    const batch = PVZ_FILES.slice(i, i + BATCH);
    await Promise.all(batch.map(async path => {
      try {
        const req = new Request(path);
        const cached = await cache.match(req);
        if (!cached) {
          const resp = await fetch(path);
          if (resp.ok) {
            await cache.put(req, resp.clone());
          }
        }
      } catch (e) { /* 单个失败不影响整体 */ }
      done++;
      if (done % 25 === 0 || done === total) {
        const pct = Math.round(done / total * 100);
        self.clients.matchAll().then(clients => {
          clients.forEach(c => c.postMessage({ type: 'precache', done, total, pct }));
        });
      }
    }));
  }
}

// ===== 运行时：网络优先，缓存兜底，后台更新缓存 =====
// 策略：先请求网络（保证线上更新能及时生效），失败回退缓存；
// 成功后把新内容写回缓存（下次离线/慢网也能秒开）。
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // 只处理同源请求
  if (url.origin !== location.origin) return;

  e.respondWith(
    fetch(req)
      .then(resp => {
        if (resp.ok) {
          const clone = resp.clone();
          caches.open(CACHE).then(c => c.put(req, clone));
        }
        return resp;
      })
      .catch(() => caches.match(req).then(cached => cached || new Response('', { status: 504, statusText: 'Offline' })))
  );
});
