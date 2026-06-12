# 偷偷给玛丽梳毛 (Brush Mari)

![:name](https://count.getloli.com/@brush-mari?name=brush-mari&theme=minecraft&padding=6&offset=0&align=top&scale=1&pixelated=1&darkmode=auto)

一个基于 HTML5 的休闲小游戏，在玛丽不注意的时候偷偷给她梳毛，同时积累分数并解锁成就。

本游戏原作者为韩国画师 **HoR호르**，原托管于 [itch.io](https://horuhara.itch.io/brush-mari) 海外平台。出于众所周知的原因，原站在国内可能无法正常访问。作为粉丝，为了让更多人能玩到这款游戏，我将网站的运行环境搬运至国内，并配置了 CDN 加速，确保能达到秒开的效果。

加速地址：[https://game.xcnahida.cn/brush-mari/](https://game.xcnahida.cn/brush-mari/)

> 本项目为个人粉丝向、为爱发电，作品版权归原作者 **HoR호르** 所有。
> 禁止任何人用于商业用途。！

# 原视频与作者链接

- 原视频地址：[https://www.bilibili.com/video/BV1RSL36aEQP](https://www.bilibili.com/video/BV1RSL36aEQP)
- 作者的哔哩哔哩（代理运营）：[https://space.bilibili.com/1767947324](https://space.bilibili.com/1767947324)
- Pixiv：[https://www.pixiv.net/en/users/71667864](https://www.pixiv.net/en/users/71667864)
- X (Twitter)：[https://x.com/horuhara](https://x.com/horuhara)

# 玩法说明

在限定时间内，用梳子在玛丽身上滑动来梳毛得分。注意不要被玛丽发现——梳得太快或太频繁会惹怒她。达到一定分数即可通关，还能解锁无限模式和多项成就。

## 基本操作

- **梳毛**：在梳毛区域内按住并拖动鼠标 / 触摸滑动
- **梳毛速度**：梳得太快会惊动玛丽，保持适中的速度
- 收集掉落的毛球和纸巾等奖励物品

# 技术栈

- **前端**：HTML5 Canvas + CSS3 + 原生 JavaScript
- **语言**：支持 English / 한국어 / 日本語 / 简体中文 四种语言切换

# 项目结构

```
brush-mari-by-horuhara/
├── index.html           # 游戏主页面
├── style.css            # 游戏样式
├── game.js              # 游戏核心逻辑
├── htmlgame.js          # HTML5 游戏辅助
├── icon.png             # 图标
├── assets/              # 静态资源
│   ├── calm/            # 玛丽平静状态素材
│   ├── angry/           # 玛丽生气状态素材
│   ├── effects/         # 毛发特效素材
│   ├── sounds/          # 音效和背景音乐
│   ├── achievements/    # 成就图标
│   ├── fonts/           # 字体文件
│   └── ...              # 其他素材
└── README.md
```

# 免责声明

本项目仅供学习交流和研究目的。作品版权归原作者 **HoR호르** 所有，禁止用于商业用途。
