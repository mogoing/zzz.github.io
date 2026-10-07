import seed_browser_use as bu
try:
    bu.resync()
    print("resync ok")
except Exception as e:
    print("resync err:", e)
try:
    bu.navigate("http://localhost:8899/ab/wmwswf.html")
    bu.wait_for_load(timeout=20)
    print("nav ok")
except Exception as e:
    print("nav err:", e)
