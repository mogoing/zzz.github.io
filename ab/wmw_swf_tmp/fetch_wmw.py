import urllib.request, os, re, time

BASE = "https://jamesland.org/flash/SWF/whersmywater/"
REF = "https://jamesland.org/flash/SWF/whersmywater/play"
OUT = "/home/user/work01/ab/wmwswf/"

def get(url, retry=2):
    for i in range(retry):
        try:
            req = urllib.request.Request(url, headers={"User-Agent":"Mozilla/5.0","Referer":REF})
            with urllib.request.urlopen(req, timeout=30) as r:
                return r.read()
        except Exception as e:
            if i == retry-1: return None
            time.sleep(1)
    return None

def save(rel, data, binary=True):
    p = os.path.join(OUT, rel)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    mode = 'wb' if binary else 'w'
    with open(p, mode) as f:
        f.write(data)
    return len(data)

files = [
    "loader.swf",
    "game_config.xml",
    "wmw_spl_act_wheresmywater_content.swf",
    "swfs/sounds.swf",
    "swfs/sounds2.swf",
    "swfs/level_container.swf",
    "swfs/swampy.swf",
    "swfs/cranky.swf",
    "images/show_logo.png",
    "images/game_logo.png",
    "strings/strings.xml",
    "new_particle_atlas.imagelist",
    "objects.imagelist",
    "Content/Textures/dirt.png",
    "Content/Textures/rock.png",
    "Content/Textures/rockshadow.png",
    "Content/Textures/rockhilight.png",
    "Content/Textures/bricks.png",
    "Content/Textures/room-HD.png",
    "Content/Textures/room_overlay-HD.png",
    "Content/Textures/Endcap-01-HD.jpg",
    "Content/Textures/level_end_cap.jpg",
    "Content/Textures/water_alpha.png",
    "Content/Textures/water_color.png",
    "Content/Textures/water_color_ooze.png",
    "Content/Levels/first_dig.png", "Content/Levels/first_dig.xml",
    "Content/Levels/hard_rock.png", "Content/Levels/hard_rock.xml",
    "Content/Levels/triple_rainbow.png", "Content/Levels/triple_rainbow.xml",
    "Content/Levels/you_need_a_new_plumber.png", "Content/Levels/you_need_a_new_plumber.xml",
    "Content/Levels/garage_door.png", "Content/Levels/garage_door.xml",
    "Content/Levels/order_gate.png", "Content/Levels/order_gate.xml",
    "Content/Levels/press_the_valve.png", "Content/Levels/press_the_valve.xml",
    "Content/Levels/beware_the_bombs.png", "Content/Levels/beware_the_bombs.xml",
    "Content/Levels/bomb-aid.png", "Content/Levels/bomb-aid.xml",
    "Content/Levels/dungeon_detective.png", "Content/Levels/dungeon_detective.xml",
    "Content/Levels/another_castle.png", "Content/Levels/another_castle.xml",
]
ok = 0; fail = []
for rel in files:
    data = get(BASE + rel)
    if data and len(data) > 50 and not data[:5].startswith(b'<!DOC'):
        save(rel, data)
        ok += 1
        print(f"OK  {len(data):>9}  {rel}")
    else:
        fail.append(rel)
        print(f"FAIL {rel} ({(len(data) if data else 0)}b)")
print(f"\n成功 {ok}/{len(files)}, 失败 {len(fail)}: {fail}")
