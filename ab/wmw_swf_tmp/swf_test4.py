import seed_browser_use as bu
import time
bu.navigate("http://localhost:8899/ab/wmwswf.html")
bu.wait_for_load(timeout=15)
time.sleep(15)
print("=== 本页 console ===")
for c in bu.console_messages():
    t = c.get('text','')
    if t.strip():
        print(c.get('type'), '|', t[:160])
print("=== 网络请求(失败) ===")
for r in bu.network_requests():
    st = r.get('status')
    if st is not None and str(st).isdigit() and int(st) >= 400:
        print(r.get('status'), r.get('url','')[:140])
