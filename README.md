# 听见 · Hear, at your own pace

面向广东高一学生的英语听说**能力训练工具**。反复听与跟读是核心；听懂由学习者自行判断。没有试卷、选择题、对错判断、分数、排名、倒计时或必须通过的关卡。

## 从这里打开

所有网页源码都在 `dist/`。这个目录只是部署目录，**不是构建产物**：直接编辑即可，不需要 npm、构建工具、后端或 API key。

```text
dist/
  index.html
  css/styles.css       # 奶油米白与豆沙玫瑰配色，响应式排版
  data/units.js        # 唯一的素材入口
  js/store.js          # 进度、历史、笔记、收藏和备份校验
  js/audio.js          # 系统朗读、本地录音与本地音频库
  js/app.js            # 页面与交互
  assets/mark.svg      # 自绘线描书本标志
README.md
ACCEPTANCE.md
LICENSE
tests/check.cjs
.github/workflows/pages.yml
netlify.toml
vercel.json
```

直接双击 `dist/index.html` 可以阅读和使用浏览器允许的功能。推荐通过 localhost 使用录音与持久化功能：

```sh
python -m http.server 8080 --directory dist
```

然后打开 `http://localhost:8080`。手机访问时请使用 HTTPS 部署地址；电脑局域网 IP 上的普通 HTTP 不等同于 localhost 安全环境。无需自行安装 Python 音频包。

## 已提供的内容

首页展示 8 个单元位置：1 个可用主题、7 个明确标记的扩充预留位。预留位没有虚构素材或完成记录。

**Teenage Life 校园与青少年生活**

- 3 段原创情景对话：社团、课后作业与休息、班级花园。每段 12 句，约 135 词。
- 2 篇原创故事：`A seat at lunch` 81 词；`An idea worth sharing` 178 词。250 词以上的挑战材料留待后续加入，没有用空内容伪装已开放。
- 1 张主题句型卡：9 个功能表达，附示例与替换提示。
- 12 个关键词 / 短语条目。

### 对话人物与同步高亮

社团对话使用用户提供的两张角色插画，分别对应 Mia（蓝色领结）和 Lily（红色领结）。人物卡与原句根据实际 `SpeechSynthesisUtterance` 的开始、结束和暂停状态同步切换，不用虚构的固定秒数轮播。点句、循环、隐藏字幕、暂停 / 继续都支持同步；角色扮演可显示“对方的回合”“轮到你开口”和“你的录音”。

电脑端人物卡与播放器并列，窄屏自动上下排列；两张人物卡仍并排。其他对话的角色未提供图片时显示姓名首字母占位，不将这两张图重复套用给 Ben、Lucy、Anna 或 Jack。故事页不强行套用对话人物图。

图片映射独立放在单元对象的 `characters` 中。例如：

```js
characters: {
  Mia: {photo:'assets/portraits/mia-20261101.jpg',position:'50% 24%',caption:'有点紧张，也愿意尝试'},
  Lily: {photo:'assets/portraits/lily-20261101.jpg',position:'50% 28%',caption:'耐心倾听，陪朋友一起出发'}
}
```

`position` 是 CSS `object-position`，只改变网页裁切显示。图片文件本身不改动。此处的人物插画由项目提交者使用 AI 生成，并明确授权随本项目一起开源发布；与源码一同按 MIT 许可提供。来源记录见 [角色插画说明](dist/assets/portraits/README.md)。

使用常见高中词汇，必要短语提供中文支架；不宣称已对某一版本“3500 词表”逐词自动认证。教师可依据本校教材进一步调整。

## 四个模块

1. **反复听**：系统英语朗读、暂停 / 继续 / 重播、0.75× / 1× / 1.25×、可选循环、点句重听、全文 / 关键词 / 隐藏字幕、中文辅助、逐句跟读与录音。进度条以句子为单位，不是秒级音轨。
2. **角色扮演**：任选一方，听另一方的台词，自由回应。提供句型与关键词，随时展开参考对话；前后切换与重练没有前置条件。
3. **故事复述**：听懂、可选 W5H 笔记、结构支架、连接词草稿、录音、参考复述与不计分的要点清单。三步可自由返回。
4. **表达与复习本**：句型听音、收藏好句、重开标记“还想再练”的素材。

“我听懂了”“我练过了”是学习者自己的标记。朗读结束不会自动判断听懂；录音与转写不会被机器评价。

## 声音、录音与隐私

- 朗读使用 `speechSynthesis`，优先系统英音，也可在设置中选择本设备的英语语音。语音清单与效果取决于设备；没有朗读接口时，页面清楚提示并允许纯文本练习。
- 朗读没有固定 WPM。0.75× / 1× / 1.25× 是浏览器的相对 rate；不同系统语音不同。某些系统语音需要联网。
- 录音使用 `MediaRecorder`，结束后回放、下载；音频通过 IndexedDB 仅保存在当前浏览器，不上传。没有麦克风权限、不支持接口或不处于安全环境时，学生仍可开口练习、记笔记与自我标记。
- IndexedDB 不可用时退化为本页内存回放，并提醒下载。清理站点数据会移除录音。累计录音时长作为练习历史保留，不因删除某段文件减少。
- 可选语音识别仅在提供 `SpeechRecognition` / `webkitSpeechRecognition` 的浏览器上启用，通常是 Chrome。**可能使用浏览器厂商的在线服务**，必须单独勾选说明并主动开启；不能转写时回到录音自评，不阻塞。
- 本站没有分析脚本、追踪器、外部网络字体或付费接口。没有录音上传入口。系统语音 / 可选转写的联网行为由浏览器服务决定。
- 录音与朗读不会主动同时开始；录音时先结束并保存，再播放示例。切换页面会停止旧朗读并保存正在结束的录音。

接口行为参考：[SpeechSynthesis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)、[getUserMedia 与安全环境](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)、[录音接口](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API/Using_the_MediaStream_Recording_API)、[Web Speech API 规范](https://webaudio.github.io/web-speech-api/)。

## 进度与备份

localStorage 保存文字记录，键名 `hear-journal-v1`。包括单元 / 模块自我标记、练习动作次数、日期历史、累计录音时长、笔记、收藏、语速与声音偏好。

- 每个单元的 3 条进度分别是：标记听懂的素材数 / 全部素材数、角色扮演自我标记数 / 对话数、复述自我标记数 / 故事数。
- 练习动作次数包括主动播放、单句重听、录音、重练与自我标记，不代表“掌握次数”。
- 连续天数仅用于回看，不设目标和断签惩罚；今天尚未练习时显示延续到昨天的连续记录。
- 到「声音与备份」导出 JSON。导入先校验、显示预览，再由用户确认替换；不支持的版本和损坏文件不会覆盖旧数据。建议恢复前导出当前记录。
- JSON **不包含音频文件**；录音请在练习手记逐段下载。导入文字备份不删除已有音频。
- localStorage 满了或禁用时仍可当次使用，底部提示及时导出。不同浏览器 / 域名 / 设备的数据不自动同步。

## 如何扩充素材

直接编辑 `dist/data/units.js` 中的 `window.HEAR_UNITS` 数组。单元 `id` 与素材 `id` 需保持稳定且唯一，已使用的 ID 不要更改，否则旧进度无法对应。

```js
{
  id: 'new-theme', title: 'A New Theme', titleZh: '新主题', label: 'UNIT 02',
  introduction: '贴近生活的主题说明',
  dialogues: [{
    id: 'a-scene', title: 'An everyday scene', titleZh: '情景标题',
    context: '人物为什么开始交谈', roles: ['A', 'B'], goal: '交流功能',
    supports: ['Could you ...?', 'What do you think about ...?'],
    lines: [{s:'A',en:'Could you help me with this plan?',zh:'你能帮我看看这个计划吗？',keys:['help','plan']},
            {s:'B',en:'Of course. Let us look at it together.',zh:'当然，我们一起看看。',keys:['together']}]
  }],
  stories: [{
    id:'a-story',title:'A short story',titleZh:'故事标题',level:'short',levelZh:'短故事',context:'背景',
    lines:[{en:'A student had a useful idea.',zh:'一个学生有个有用的想法。',keys:['student','idea']}],
    w5h:{Who:'a student',What:'an idea',When:'one day',Where:'at school',Why:'help others',How:'shared an idea'},
    points:['人物和事情','经过和结果'],retelling:'This story is about a student with an idea.'
  }],
  patterns:[{id:'request',type:'请求',en:'Could you ...?',zh:'你能……吗？',example:'Could you help me?',replace:'help me → say it again'}],
  vocabulary:[{word:'share',meaning:'分享',example:'Let us share our ideas.'}]
}
```

对话可扩充 `lines`，应让两个角色都有参与，避免单独旁白破坏问答上下文。每篇故事都提供 6 个 `w5h` 提示与要点清单。增加第二个真实主题后，首页会自动替换一个预留位置，不需要改页面代码。

## 部署

### GitHub Pages（推荐，无构建）

1. 将本项目 Fork 或上传到你的 GitHub 仓库，保留 MIT 许可。
2. 在仓库 **Settings → Pages → Source** 选择 **GitHub Actions**。
3. 在 **Actions → Publish static journal → Run workflow** 手动启动部署。附带工作流直接上传 `dist/`，不安装依赖、不执行构建；公开源码不会自动启用网站托管。
4. 等 Pages 部署完成，使用 GitHub 显示的 HTTPS 地址。所有网页资源使用相对路径，支持仓库子路径。

工作流依据 GitHub 官方的 [静态 Pages 工作流](https://github.com/actions/starter-workflows/blob/main/pages/static.yml) 配置，发布目录为 `dist/`，默认只允许手动启动。若需要自动部署，可自行增加 `push` 触发器。

也可只将 `dist/` 的内容放在仓库根目录，使用 Pages 的分支部署；README 与 LICENSE 可一同保留。

### Netlify

连接仓库或拖拽 `dist/` 文件夹。已提供 `netlify.toml`，发布目录为 `dist`，没有构建命令。

### Vercel

导入仓库，Framework 选 **Other**，Output Directory 为 `dist`，关闭构建命令。项目已提供相应 `vercel.json`，无需服务端函数。

### 任何静态服务器

将 `dist/` 内容作为网站根目录即可。使用 HTTPS 才能稳定申请麦克风权限。

## 校验与已知边界

`node tests/check.cjs` 可进行原生脚本语法、数据结构、词数、持久化与朗读队列的检查。可选安装测试专用 DOM 环境后再检查界面交互；不属于网站运行依赖：

```sh
npm install --no-save --prefix .test-tools jsdom@26.1.0
node tests/check.cjs
```

设备端的真实扬声器、麦克风权限、系统音色与手机排版仍需人工验收。检查清单与已验证范围见 `ACCEPTANCE.md`。没有把模拟接口检查写成真机录音成功。

## 许可

MIT，见 `LICENSE`。原创文本、界面代码、自绘 SVG，以及提交者声明为其使用 AI 生成并明确授权开源发布的两张角色插画，均随本项目按此许可提供。本站不包含原成人口语项目的人物照片、故事、个人资料或音频。
