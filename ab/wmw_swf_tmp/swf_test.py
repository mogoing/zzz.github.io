import seed_browser_use as bu
import time
bu.navigate("http://localhost:8899/ab/wmwswf.html")
bu.wait_for_load(timeout=30)
time.sleep(20)
frame = bu.screenshot()
print("shot:", frame.path)
print("=== console ===")
for c in bu.console_messages()[-10:]:
    t = c.get('text','')
    if t.strip(): print(c.get('type'), t[:150])
