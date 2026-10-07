/**
 * LibreTV 代理 Worker（干净版）
 * 职责：
 *   1. /proxy/<encoded-url> —— 转发任意 URL，加 CORS 头与防盗链 Referer
 *   2. m3u8 内容自动重写相对路径为 /proxy/ 绝对路径，保证浏览器能拉到分片/密钥
 * 无 KV、无递归、无缓存 —— 单一职责，最大化可靠性
 */

const PROXY_PREFIX = '/proxy/';

const M3U8_TYPES = [
  'application/vnd.apple.mpegurl',
  'application/x-mpegurl',
  'audio/mpegurl',
];

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

function isM3u8(contentType, body) {
  if (!contentType) return false;
  for (const t of M3U8_TYPES) {
    if (contentType.toLowerCase().includes(t)) return true;
  }
  if (body && body.startsWith('#EXTM3U')) return true;
  return false;
}

/** 重写 m3u8 里的相对路径为 /proxy/ 绝对路径 */
function rewriteM3u8(baseUrl, m3u8Text) {
  return m3u8Text
    .split('\n')
    .map((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('#EXT-X-KEY') || trimmed.startsWith('#EXT-X-MAP')) {
        return line.replace(/URI="([^"]+)"/g, (_m, uri) => {
          const abs = new URL(uri, baseUrl).toString();
          return `URI="${PROXY_PREFIX}${encodeURIComponent(abs)}"`;
        });
      }
      if (trimmed && !trimmed.startsWith('#')) {
        try {
          const abs = new URL(trimmed, baseUrl).toString();
          return `${PROXY_PREFIX}${encodeURIComponent(abs)}`;
        } catch {
          return line;
        }
      }
      return line;
    })
    .join('\n');
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    if (!path.startsWith(PROXY_PREFIX)) {
      return env.ASSETS.fetch(request);
    }

    let targetUrl;
    try {
      targetUrl = decodeURIComponent(path.slice(PROXY_PREFIX.length));
      const t = new URL(targetUrl);
      if (t.protocol !== 'http:' && t.protocol !== 'https:') throw new Error('bad protocol');
    } catch {
      return new Response('Invalid proxy URL', { status: 400 });
    }

    const headers = new Headers(request.headers);
    headers.set('User-Agent', UA);
    headers.set('Referer', new URL(targetUrl).origin + '/');
    headers.delete('host');
    headers.delete('cookie');

    try {
      const upstream = await fetch(targetUrl, {
        method: request.method,
        headers,
        redirect: 'follow',
      });

      const contentType = upstream.headers.get('Content-Type') || '';

      const responseHeaders = new Headers();
      responseHeaders.set('Access-Control-Allow-Origin', '*');
      responseHeaders.set('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS');
      responseHeaders.set('Access-Control-Allow-Headers', '*');
      const cacheControl = upstream.headers.get('Cache-Control');
      if (cacheControl) responseHeaders.set('Cache-Control', cacheControl);
      responseHeaders.set('Content-Type', contentType);

      const looksM3u8 = isM3u8(contentType, '');

      if (looksM3u8) {
        const text = await upstream.text();
        const rewritten = rewriteM3u8(targetUrl, text);
        return new Response(rewritten, {
          status: 200,
          headers: responseHeaders,
        });
      }

      return new Response(upstream.body, {
        status: upstream.status,
        headers: responseHeaders,
      });
    } catch (err) {
      return new Response(`Proxy error: ${err.message}`, {
        status: 502,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'text/plain; charset=utf-8',
        },
      });
    }
  },
};