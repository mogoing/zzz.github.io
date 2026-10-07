import seed_browser_use as bu
import time
bu.navigate("http://localhost:8899/ab/wmwswf.html")
bu.wait_for_load(timeout=20)
time.sleep(18)
print("=== 8899 全部请求 ===")
for r in bu.network_requests():
    u = r.get('url','')
    if '8899' in u:
        print(r.get('status'), u.replace('http://localhost:8899','')[:110])
