# Nuxt 学习笔记（随学随记）

> 配合 `Nuxt每日任务清单.md` 使用：清单管"今天做什么"，本笔记管"今天学到了什么 + 踩了什么坑"。
> 用法：每天学完，把当天那格填满；遇到坑立刻进「踩坑表」；想到面试能讲的点立刻进「面试预埋点」。

---

## 一、核心概念速查（理论沉淀，随时补）

### Agent / 智能体
- 定义：能感知环境、自主规划调用工具来完成任务的 AI 程序（不止是"聊天"）。
- 我们做的：Nuxt 前端 + Coze Bot，Bot 就是被调用的智能体。

### Token
- 是什么：大模型处理文本的最小单位，≈ 一个"字片段"（中文常 1 字≈1-2 token，英文 1 词≈1-2 token）。
- 怎么计费：**输入 token + 输出 token 都算钱**，按量计费。
- 实操提醒：长 system prompt、长历史会话都会吃 token，要做裁剪/摘要。

### 提示词 Prompt
- 是什么：给模型的"指令"。结构通常 = 角色 + 任务 + 约束 + 示例。
- 我们用法：根据前端语言动态拼 system prompt（zh 中文指令 / en 英文指令）。

### SSE（Server-Sent Events）
- 是什么：服务端单向向浏览器推送事件的协议（基于 HTTP，长连接，text/event-stream）。
- 为什么 LLM 流式用它而不是 WebSocket：单向（模型→用户）、基于 HTTP 更易过代理/网关、实现轻；WebSocket 是双向全双工，对"只输出"场景过重。
- 坑：iOS WKWebView 长连接易断流，需心跳 + 自动重连 + 轮询降级。

### Nuxt Server 代理
- 原则：**密钥（Coze token）只放服务端**，前端只调自己的 `/api/*`，服务端再转发 Coze。
- 好处：token 不暴露、可统一加鉴权/限流/日志、规避浏览器跨域。

### i18n（多语言）
- 我们用 `@nuxtjs/i18n`，`locales: [en, zh]`，文案放 `zh.json`/`en.json`，页面用 `$t()`。
- 语言选择存 `localStorage`，刷新保留。

### Nuxt 4 目录要点
- 源码根默认是 `app/`：`app/app.vue`(入口壳)、`app/pages/`(文件路由)、`app/components/`、`app/composables/`、`app/stores/`(pinia)、`app/i18n/`。
- `server/`(接口) 和 `public/` 仍在**项目根**，不在 app 内。
- 文件路由：在 `app/pages/` 建 `.vue` 即自动生成路由，无需手写 router。

---

## 二、每日笔记（Day 1–30）

### Day 1 ｜ __/__　工程跑通 + AI 基础
- 理论笔记（Agent 是什么）：
- 编码笔记（跑通步骤 / 目录认识）：
- 卡点：
- 待复习：

### Day 2 ｜ __/__　文件路由 + Token
- 理论笔记（Token / 计费）：
- 编码笔记（pages 路由 / NuxtPage）：
- 卡点：
- 待复习：

### Day 3 ｜ __/__　shadcn-vue + 调用计费
- 理论笔记（API 调用 / 计费）：
- 编码笔记（shadcn 安装 / Button）：
- 卡点：

### Day 4 ｜ __/__　composables + pinia + 提示词概念
- 理论笔记（提示词基础）：
- 编码笔记（自动导入 / store）：
- 卡点：

### Day 5 ｜ __/__　Server API + Coze 平台
- 理论笔记（Coze 控制台 / 建 Bot）：
- 编码笔记（echo 接口 / runtimeConfig / .env）：
- 卡点：

### Day 6 ｜ __/__　文件上传 + i18n 语言包
- 理论笔记：
- 编码笔记（upload 接口 / i18n 配置）：
- 卡点：

### Day 7 ｜ __/__　全局语言 + WebView 适配 + 阶段1复盘
- 复盘（阶段1 产出）：
- WebView 适配要点：
- 卡点：

### Day 8 ｜ __/__　SSE 原理 + 提示词实操 + 流式文档
- 理论笔记（SSE vs WebSocket / Coze stream 格式）：
- 编码笔记（链路草图）：
- 卡点：

### Day 9 ｜ __/__　useSse 骨架
- 编码笔记（connect/onMessage/reset）：
- 卡点：

### Day 10 ｜ __/__　useSse 完善（心跳/重连/错误）
- 编码笔记：
- 卡点：

### Day 11 ｜ __/__　WebView 兼容 + 轮询降级
- 编码笔记（UA 识别 / 降级开关）：
- 卡点：

### Day 12 ｜ __/__　对话 UI 气泡 + loading
- 编码笔记：
- 卡点：

### Day 13 ｜ __/__　滚动跟随 + 会话侧边栏
- 编码笔记：
- 卡点：

### Day 14 ｜ __/__　文案全量 i18n + Mock 打字机
- 编码笔记：
- 卡点：

### Day 15 ｜ __/__　双端 UI + 阶段2复盘
- 复盘（阶段2 产出）：
- 卡点：

### Day 16 ｜ __/__　Coze 建 Bot + 取密钥
- 笔记（bot_id / token 存放）：
- 卡点：

### Day 17 ｜ __/__　代理链路
- 编码笔记（/api/chat 中转）：
- 卡点：

### Day 18 ｜ __/__　Server 转流式
- 编码笔记：
- 卡点：

### Day 19 ｜ __/__　语种注入 system prompt
- 编码笔记（zh/en 指令拼接）：
- 卡点：

### Day 20 ｜ __/__　会话持久化
- 编码笔记：
- 卡点：

### Day 21 ｜ __/__　会话重命名/删除
- 编码笔记：
- 卡点：

### Day 22 ｜ __/__　文件上传问答
- 编码笔记（pdf/md/txt/srt）：
- 卡点：

### Day 23 ｜ __/__　V0 联调
- 复盘（全链路）：
- 卡点：

### Day 24 ｜ __/__　阶段3复盘 + 踩坑初稿
- 复盘：
- 卡点：

### Day 25 ｜ __/__　异常处理
- 编码笔记：
- 卡点：

### Day 26 ｜ __/__　大文件限制 + 重连兜底
- 编码笔记：
- 卡点：

### Day 27 ｜ __/__　WebView 真机测试
- 真机结论（iOS/安卓）：
- 卡点：

### Day 28 ｜ __/__　Dockerfile
- 编码笔记：
- 卡点：

### Day 29 ｜ __/__　部署拿地址
- 部署结论（平台 / 地址）：
- 卡点：

### Day 30 ｜ __/__　README + 面试脚本
- 交付清单：
- 卡点：

---

## 三、踩坑记录表（遇到立刻记）

| 日期 | 现象 | 原因 | 解决 | 状态 |
|---|---|---|---|---|
| | | | | |

## 四、面试预埋点（边做边写草稿）

1. **为什么用 SSE 不用 WebSocket 做 LLM 流式？**
   - 答：
2. **为什么加 Nuxt Server 代理层，不让前端直连 Coze？**
   - 答：
3. **iOS WKWebView 下 SSE 断流的现象 / 原因 / 降级？**
   - 答：
4. **多语言方案：前端语种如何透传大模型、动态改 system prompt？**
   - 答：
5. **APP 内嵌 H5 适配要点、容器与浏览器差异？**
   - 答：

## 五、资源链接（备查）
- 黑马 Coze 教程：https://www.bilibili.com/video/BV12omoB4ExF/
- 黑马大模型开发入门路线图：https://yun.itheima.com/subject/aimap/index.html
- Coze 官方文档（chat / stream）：https://www.coze.cn/docs
- Nuxt 官方文档：https://nuxt.com/docs
