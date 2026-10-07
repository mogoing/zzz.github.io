import seed_browser_use as bu
import time
bu.navigate("http://localhost:8899/ab/wmwswf.html")
bu.wait_for_load(timeout=20)
time.sleep(30)
frame = bu.screenshot()
print("shot:", frame.path)
# 控制台 Ruffle 相关
for c in bu.console_messages():
    t = c.get('text','')
    if 'ruffle' in t.lower() or 'error' in t.lower() or 'warn' in t.lower():
        print("LOG:", c.get('type'), t[:200])
