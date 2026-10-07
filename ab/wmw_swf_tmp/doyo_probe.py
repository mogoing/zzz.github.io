import seed_browser_use as bu
import time
bu.navigate("https://www.doyo.cn/flash/game/640023")
bu.wait_for_load(timeout=20)
time.sleep(6)
# 看页面是否有播放器/封面
print(bu.get_page_text()[:400])
# 找 swf 请求
reqs = bu.network_requests()
swfs = [r for r in reqs if '.swf' in r.get('url','') or 'u7u9' in r.get('url','')]
for r in swfs[:10]:
    print("SWF/跳转:", r.get('url','')[:160], r.get('status'))
