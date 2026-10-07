import seed_browser_use as bu
import time
bu.navigate("http://localhost:8899/ab.html")
bu.wait_for_load(timeout=30)
time.sleep(22)
js = "JSON.stringify({rp: !!window.RufflePlayer, newest: !!(window.RufflePlayer && window.RufflePlayer.newest()), errShown: document.getElementById('err').style.display})"
print("ab.html 状态:", bu.js(js))
