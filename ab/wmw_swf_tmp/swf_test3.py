import seed_browser_use as bu
import time
# 清 SW + 缓存
bu.navigate("http://localhost:8899/ab/wmwswf.html")
bu.wait_for_load(timeout=15)
bu.js("caches.keys().then(ks=>ks.forEach(k=>caches.delete(k))); navigator.serviceWorker.getRegistrations().then(rs=>rs.forEach(r=>r.unregister()));")
time.sleep(2)
bu.navigate("http://localhost:8899/ab/wmwswf.html")
bu.wait_for_load(timeout=30)
time.sleep(22)
js = "JSON.stringify({rp: !!window.RufflePlayer, newest: !!(window.RufflePlayer && window.RufflePlayer.newest()), players: document.querySelectorAll('ruffle-player').length, errShown: document.getElementById('err').style.display})"
print("状态:", bu.js(js))
frame = bu.screenshot()
print("shot:", frame.path)
