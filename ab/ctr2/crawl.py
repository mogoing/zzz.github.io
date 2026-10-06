#!/usr/bin/env python3
# 全量爬取 17yoo 割绳子H5 资源 -> 本地 res/
import os, re, sys, urllib.request, concurrent.futures, time

BASE = "https://static.17yoo.cn/gamebox/80228"
LOCAL = os.path.join(os.path.dirname(os.path.abspath(__file__)), "res")
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
REF = "https://www.17yoo.cn/detail/9118/"

# 主清单（从线上抓包获得）
MAIN = [
    "loader_bg.jpg", "loader.avif", "loader.dat",
    "lang/font-en.dat", "lang/font-en.avif",
    "lang/font-ja.dat", "lang/font-ja.avif",
    "lang/font-ko.dat", "lang/font-ko.avif",
    "lang/font-ru.dat", "lang/font-ru.avif",
    "lang/font-de.dat", "lang/font-de.avif",
    "lang/font-es.dat", "lang/font-es.avif",
    "lang/font-fr.dat", "lang/font-fr.avif",
    "lang/font-br.dat", "lang/font-br.avif",
    "lang/font-it.dat", "lang/font-it.avif",
    "lang/font-nl.dat", "lang/font-nl.avif",
    "menu/bg.jpg", "menu/bg2.avif", "menu/shadow.avif",
    "menu/ui.avif", "menu/ui.json",
    "menu/salute.avif", "menu/salute.json",
    "menu/season1.avif", "menu/season1.json",
    "menu/season2.avif", "menu/season2.json",
    "menu/season3.avif", "menu/seasons.json",
    "menu/cut-2x.avif", "menu/cut-2x.json",
    "strings.json",
    "audio/aac/sound.aac",
    "audio/aac/menu_music.aac",
    "video/intro_landscape.mp4",
]

# box 关卡（box01-17）
BOX_FILES = ["maps.json", "bg.jpg", "cover.avif", "support.avif"]
boxes = []
for i in range(1, 18):
    b = f"box{i:02d}"
    for f in BOX_FILES:
        boxes.append(f"{b}/{f}")

ALL = MAIN + boxes

def fetch(rel):
    url = f"{BASE}/res/{rel}?v=1.3.35"
    out = os.path.join(LOCAL, rel.replace("/", os.sep))
    os.makedirs(os.path.dirname(out), exist_ok=True)
    if os.path.exists(out) and os.path.getsize(out) > 0:
        return ("skip", rel)
    try:
        req = urllib.request.Request(url, headers={"User-Agent": UA, "Referer": REF})
        with urllib.request.urlopen(req, timeout=25) as r:
            data = r.read()
        if len(data) < 50 and b"Error" in data[:200]:
            return ("404", rel)
        with open(out, "wb") as f:
            f.write(data)
        return ("ok", rel, len(data))
    except Exception as e:
        return ("fail", rel, str(e)[:60])

print(f"共 {len(ALL)} 个资源，开始下载...")
results = []
with concurrent.futures.ThreadPoolExecutor(max_workers=12) as ex:
    futs = {ex.submit(fetch, r): r for r in ALL}
    for fut in concurrent.futures.as_completed(futs):
        r = fut.result()
        results.append(r)
        tag = r[0]
        if tag == "ok":
            print(f"OK   {r[1]} ({r[2]}B)")
        elif tag != "skip":
            print(f"{tag.upper()} {r[1]} {r[2] if len(r)>2 else ''}")

ok = sum(1 for r in results if r[0] in ("ok", "skip"))
fails = [r for r in results if r[0] not in ("ok", "skip")]
print(f"\n完成 {ok}/{len(ALL)}，失败 {len(fails)}")
for f in fails:
    print("失败:", f)
