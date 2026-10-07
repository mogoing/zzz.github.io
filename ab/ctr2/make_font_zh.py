#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""生成割绳子简体中文字体 font-zh（dat + avif）。
格式：famobi 多段式 dat，单段：6B头 + BMF v3 + info(15B) + common(15B) + pages(2B) + chars(20B/条)
字符记录：标准 BMFont 20 字节：id(uint32) x y w h(uint16) xoff yoff adv(int16) page chnl(uint8)
"""
import json, struct, os
from PIL import Image, ImageDraw, ImageFont

BASE = '/home/user/work01/ab/ctr2/res'
FONT = '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'

# ---------- 1. 收集字符集 ----------
d = json.load(open(f'{BASE}/strings.json', encoding='utf-8'))
zh_text = ''.join(v['zh'] for v in d.values() if isinstance(v, dict) and v.get('zh'))
chars = set()
# ASCII 可打印 32-126
for c in range(32, 127):
    chars.add(chr(c))
# zh 文本全部字符
for c in zh_text:
    chars.add(c)
# 常用补充标点
for c in '·…—『』「」（）《》':
    chars.add(c)
chars = sorted(chars)
print(f"字符总数: {len(chars)}")

# ---------- 2. 布局 ----------
COL, CELL = 32, 48
ROWS = (len(chars) + COL - 1) // COL
W, H = COL * CELL, ROWS * CELL
print(f"图集: {W}x{H}, 行数 {ROWS}, 容量 {COL*ROWS}")

# ---------- 3. 渲染 ----------
font = ImageFont.truetype(FONT, 44)
atlas = Image.new('RGBA', (W, H), (0, 0, 0, 0))
draw = ImageDraw.Draw(atlas)
records = []
tmp = Image.new('RGBA', (CELL, CELL), (0, 0, 0, 0))
td = ImageDraw.Draw(tmp)

for i, ch in enumerate(chars):
    col, row = i % COL, i // COL
    tmp.paste((0, 0, 0, 0), (0, 0, CELL, CELL))
    td.text((CELL/2, CELL/2), ch, font=font, fill=(255, 255, 255), anchor='mm')
    # 测 ink bbox
    bbox = tmp.getbbox()
    if bbox is None:
        w = h = 12
        x = col * CELL + (CELL - w) // 2
        y = row * CELL + (CELL - h) // 2
        draw.rectangle([x, y, x + w, y + h], fill=(255, 255, 255))
        records.append((ord(ch), x, y, w, h, 0, 0, CELL))
        continue
    x0, y0, x1, y1 = bbox
    w, h = x1 - x0 + 1, y1 - y0 + 1
    # 字符 ink 居中于格子
    x = col * CELL + (CELL - w) // 2
    y = row * CELL + (CELL - h) // 2
    atlas.paste(tmp.crop((x0, y0, x1 + 1, y1 + 1)), (x, y))
    records.append((ord(ch), x, y, w, h, 0, 0, CELL))

# 保存 PNG（中间产物）
atlas.save('/tmp/font_zh_atlas.png')
print("PNG 保存 OK")

# ---------- 4. 转 AVIF ----------
os.system(f'convert /tmp/font_zh_atlas.png -quality 90 {BASE}/lang/font-zh.avif')
avif_size = os.path.getsize(f'{BASE}/lang/font-zh.avif')
print(f"font-zh.avif: {avif_size} 字节")

# ---------- 5. 生成 dat ----------
out = bytearray()
out += bytes([0x0b, 0x00, 0x00, 0x00, 0x50, 0x01])          # 6B 段头
out += b'BMF' + bytes([3])                                  # BMF v3
out += bytes([1]) + struct.pack('<I', 15) + bytes.fromhex('64000101010001010108010101012d')  # info 照抄
common = struct.pack('<HHHH', 48, 40, W, H) + bytes([0x01, 0x00, 0x01, 0x01, 0x01, 0x01, 0x01])  # 15B：lineHeight base scaleW scaleH pages packed + 5B chnl
out += bytes([1]) + struct.pack('<I', len(common)) + common               # common
out += bytes([1]) + struct.pack('<I', 2) + bytes([0x2d, 0x00])            # pages
# chars
recs = b''
for rec in records:
    cid, x, y, w, h, xoff, yoff, adv = rec
    recs += struct.pack('<IHHHHhhhBB', cid, x, y, w, h, xoff, yoff, adv, 1, 1)
out += bytes([1]) + struct.pack('<I', len(recs)) + recs
open(f'{BASE}/lang/font-zh.dat', 'wb').write(out)
print(f"font-zh.dat: {len(out)} 字节, {len(records)} 条记录")

# ---------- 6. 校验 ----------
# 回读解析
data = open(f'{BASE}/lang/font-zh.dat', 'rb').read()
assert data[:6] == bytes([0x0b, 0, 0, 0, 0x50, 1])
idx = data.find(b'BMF')
pos = idx + 4
blocks = []
while pos < len(data) - 4:
    bt = data[pos]
    size = struct.unpack('<I', data[pos+1:pos+5])[0]
    if size > 200000 or pos + 5 + size > len(data):
        break
    blocks.append((bt, size))
    pos += 5 + size
print("回读 blocks:", blocks)
n = blocks[-1][1] // 20
print(f"chars {n} 条, 记录数一致: {n == len(records)}")
EOF_MARK = True
