import seed_browser_use as bu
import time
bu.navigate("http://www.17yy.com/f/play/73185.html")
bu.wait_for_load(timeout=20)
time.sleep(8)
reqs = bu.network_requests()
swfs = [r for r in reqs if '.swf' in (r.get('url') or '')]
print("swf 请求数:", len(swfs))
for r in swfs[:12]:
    print("SWF:", r.get('url','')[:170], r.get('status'))
# 兜底：页面文本找 swf
txt = bu.get_page_text()
import re
for m in re.findall(r'[^ \n\r]*\.swf[^ \n\r]*', txt)[:8]:
    print("页内swf:", m[:170])
