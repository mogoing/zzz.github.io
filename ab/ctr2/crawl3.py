#!/usr/bin/env python3
# 补下载：video 其他 mp4 + game/ 全部 + png 备选
import os, urllib.request, concurrent.futures

BASE = "https://static.17yoo.cn/gamebox/80228"
LOCAL = os.path.join(os.path.dirname(os.path.abspath(__file__)), "res")
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
REF = "https://www.17yoo.cn/detail/9118/"

need = []
for l in open('/tmp/ctr2_manifest.txt'):
    f = l.strip()
    if not f: continue
    p = os.path.join(LOCAL, f.replace('/', os.sep))
    if not os.path.exists(p) or os.path.getsize(p) == 0:
        need.append(f)
print(f"待补 {len(need)} 个")

def fetch(rel):
    url = f"{BASE}/res/{rel}?v=1.3.35"
    out = os.path.join(LOCAL, rel.replace("/", os.sep))
    os.makedirs(os.path.dirname(out), exist_ok=True)
    try:
        req = urllib.request.Request(url, headers={"User-Agent": UA, "Referer": REF})
        with urllib.request.urlopen(req, timeout=40) as r:
            data = r.read()
        if len(data) < 50 and b"Error" in data[:300]:
            return ("404", rel)
        with open(out, "wb") as f:
            f.write(data)
        return ("ok", rel, len(data))
    except Exception as e:
        return ("fail", rel, str(e)[:50])

results = []
with concurrent.futures.ThreadPoolExecutor(max_workers=14) as ex:
    futs = {ex.submit(fetch, r): r for r in need}
    for fut in concurrent.futures.as_completed(futs):
        r = fut.result()
        results.append(r)
        if r[0] == "ok":
            print(f"OK   {r[1]} ({r[2]}B)")
        elif r[0] != "404":
            print(f"{r[0].upper()} {r[1]} {r[2] if len(r)>2 else ''}")

ok = sum(1 for r in results if r[0] == "ok")
fails = [r for r in results if r[0] != "ok"]
print(f"\n补下载成功 {ok}，失败 {len(fails)}")
# 只列出非 404 的失败
for f in fails:
    if f[0] != "404":
        print("失败:", f)
