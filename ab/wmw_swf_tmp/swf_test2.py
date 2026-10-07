import seed_browser_use as bu
import time
bu.navigate("http://localhost:8899/ab/wmwswf.html")
bu.wait_for_load(timeout=30)
time.sleep(20)
js = "JSON.stringify({rp: !!window.RufflePlayer, newest: !!(window.RufflePlayer && window.RufflePlayer.newest()), players: document.querySelectorAll('ruffle-player').length, errShown: document.getElementById('err').style.display, loading: document.getElementById('loading').style.display})"
print("状态:", bu.js(js))
frame = bu.screenshot()
print("shot:", frame.path)
