# Beyond the Wandering Earth — 离线镜像 + 移动端 H5

原站：https://wangheng.cc.cd/ （Three.js 制作的《流浪地球2》主题 3D 影片体验站）

本文件夹是该站的**完整爬取镜像**：HTML、CSS、JS、行星贴图、GLB 模型、Three.js、
Google 字体全部本地化，可完全离线运行；并叠加了一层移动端 H5 适配。

## 怎么运行

**方式一：双击启动脚本（最省事）**

| 双击 | 说明 |
| --- | --- |
| `1-直接打开.bat` | 直接以 `file://` 打开 `index.html`。脚本会用 `--allow-file-access-from-files` 参数启动一个独立的浏览器窗口放行本地文件（不影响你日常浏览器；不加参数直接双击 index.html 会被浏览器拦截，加载页会出红字提示） |
| `2-本地服务器.bat` | 自动起本地服务器并打开 http://localhost:8080（功能最完整，推荐） |

**方式二：手动起服务器**

```bash
cd whcccd
python serve.py          # 打开 http://localhost:8080
```

- **电脑上**：访问 http://localhost:8080
- **手机上（H5 测试）**：手机连同一个 Wi-Fi，访问 `serve.py` 打印的
  `http://<电脑IP>:8080`
- 没有 `serve.py` 也可以：`python -m http.server 8080`

打开后点 **▶ Begin the voyage**（2 分半钟带声光效的影片），或 **Free camera**
自由飞行；手机上单指拖动转视角、竖向滑动穿越时间、点按标记聚焦。

## 相对原站的 H5 改动

原站本身已支持触摸和小屏，镜像只做了**增量适配**，功能逻辑与原站一致：

| 文件 | 作用 |
| --- | --- |
| `css/h5.css` | 触摸设备去掉点按延迟/点按高亮、禁用下拉刷新与橡皮筋回弹、放大图标按钮点击区、手机上隐藏 “F 键自由相机” 键盘提示 |
| `js/h5.js` | 触摸设备把开始页提示 `Scroll→Swipe`、`Click→Tap` |
| `js/boot.js` | `file://` 红字提示改为**探测到真被拦截时才显示**（经 `1-直接打开.bat` 打开时不再误报），提示语改为指向两个启动脚本 |
| `index.html` | 追加 iOS 添加到主屏（standalone）所需的3 个 meta 标签，引入 h5 增量文件；移除原站 Cloudflare 统计 beacon（现在零外链） |
| `serve.py` | 一键本地/局域网服务器（含 `.wasm`/`.glb` MIME、禁缓存） |
| `1-直接打开.bat` / `2-本地服务器.bat` | 双击即用的两种启动方式 |
| `fonts/` | 原版 Google Fonts（Orbitron / Rajdhani / JetBrains Mono）已下载本地，离线可用 |

## 目录结构

```
whcccd/
├── index.html              入口（原站 + h5 增量）
├── 1-直接打开.bat           双击：file:// 直接打开（自动加放行参数）
├── 2-本地服务器.bat         双击：起服务器并打开 localhost:8080
├── css/beyond.css          原站样式（含原生移动端断点）
├── css/h5.css              H5 适配层（新增）
├── js/boot.js              加载看门狗（file:// 提示已按上述方式微调）
├── js/h5.js                H5 提示文案适配（新增）
├── js/beyond/…             原站主程序（main/earth/solar/galaxy/story…）
├── js/fx/…                 原站特效（大气/烟柱/三平面贴图…）
├── vendor/three/…          Three.js r1xx + examples/jsm + Draco 解码器
├── assets/…                行星贴图、银河全景、地球夜景、ISS/哈望远镜模型等（约 27 MB）
├── fonts/…                 本地化 Google 字体
├── serve.py                本地服务器
└── README.md               本文件
```

## 注意

- 总大小约 28 MB，首次加载会看到 “ESTABLISHING UPLINK…” 进度条，属正常。
- 全站零外链（原 Cloudflare 统计 beacon 已删），断网可用。
- 无 WebGL 的浏览器会在加载页提示 `SYSTEM FAULT`。
