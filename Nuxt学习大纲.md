# Nuxt 学习大纲（30天 ｜ 实战导向）

> 依据：`README计划/第一个月学习计划.md`
> 项目定位：支持多语言、可 APP 内嵌 WebView 的**流式 AI 对话 H5**（对接 Coze）
> 适用对象：有 2 年 Vue3 经验、熟悉 i18n 与 WebView 的前端
> ⚠️ 版本说明：原计划写的是 Nuxt3，本仓库实际基于 **Nuxt 4.6+**。两者核心 API 一致（Server Routes、composables、auto-import、文件路由、`@nuxtjs/i18n`），本大纲通用，仅在初始化命令上以 Nuxt 4 为准。

---

## 一、总体学习路线（主线）

```
Nuxt 基建  →  SSE 流式封装  →  Coze OpenAPI 对接  →  兼容适配 + 部署上线
   (D1-7)        (D8-15)           (D16-24)             (D25-30)
```

配套理论贯穿全程：黑马模块01（AI 基础 / Token / 提示词 / Coze 平台）+ Coze 官方流式 API 文档。

---

## 二、阶段大纲

### 阶段 1 ｜ Day 1–7　Nuxt 基建 & i18n 集成

**学习目标**：跑通 Nuxt 工程骨架，具备服务端能力与多语言基础。

- 项目初始化（Nuxt 4）：`npx nuxi@latest init`，集成 `shadcn-vue`
- 核心概念：`composables` 自动导入、文件路由、`layout`、`pinia` 状态管理
- Server API：`server/api` 下写 POST 接口、环境变量（`runtimeConfig` / `.env`）、文件上传接口
- 多语言：`@nuxtjs/i18n` 配置 `en/zh` 语言包 + 全局语言状态
- WebView 适配基础：`viewport`、安全区（`env(safe-area-inset-*)`）、回弹禁止、WKWebView 认知
- **跳过**：i18n 高级 SEO、PWA、Nuxt Content、静态博客等无关内容

**本周产出**
- 仓库初始化 + git 规范提交
- i18n 语言切换跑通
- 2 个测试 Server API（`echo`、`文件接收`）

---

### 阶段 2 ｜ Day 8–15　SSE 流式封装 + 对话 UI + WebView 兼容

**学习目标**：沉淀可复用的流式通信能力与对话界面。

- SSE 原理：对比 WebSocket，讲清 LLM 流式场景为何选 SSE
- 封装 `composables/useSse.ts`：连接 / 接收 / 重置 / 心跳 / 自动重连 / 错误捕获
- WebView 长连接兼容：iOS WKWebView、安卓 WebView 坑点，预留**轮询降级**方案
- 对话页开发：消息气泡、loading、滚动跟随、会话侧边栏（pinia 管理）
- 所有文案 / 报错提示接入 i18n

**本周产出**
- 通用 `useSse` Hook（V1/V2/V3 全程复用）
- Mock 流式接口联调，实现打字机效果
- 双端 UI：桌面后台版 + 移动端内嵌 H5 版

---

### 阶段 3 ｜ Day 16–24　对接 Coze OpenAPI & i18n 联动大模型

**学习目标**：打通真实链路，实现多语言驱动的 AI 问答。

- Coze 平台：创建 Bot，获取 `bot_id`、个人 token
- 代理链路设计：前端 → **Nuxt ServerAPI 中转** → Coze 流式接口（密钥只在服务端）
- 语种自动注入 system prompt：前端语言 → 服务端拼接对应语种指令
- 会话持久化、重命名、删除
- 文件上传问答：`pdf/md/txt/srt`（为直播回放 RAG 预埋）

**本周产出**
- V0 原型跑通：流式问答 + 文件问答 + 多语言切换
- 切换英文时 AI 自动用英文回答

---

### 阶段 4 ｜ Day 25–30　边界完善、容器测试、部署、文档

**学习目标**：可对外演示的线上 V0 项目 + 可复用资产。

- 异常处理：断网 / SSE 超时 / 接口报错 / 大文件限制 / 重连兜底
- WebView 真机测试：用业务 APP 容器打开 H5，验证流式稳定性
- `Dockerfile` 编写，Nuxt 容器打包
- 部署：Vercel / 轻量云服务器，拿到在线演示地址
- 撰写 README：架构图、功能截图、部署步骤、踩坑清单、适配说明

**本周产出**
- 可对外演示的线上 V0 项目
- README + 踩坑笔记 + 面试讲解脚本

---

## 三、每日时间分配（工作清闲、充足学习版）

| 时段 | 内容 | 时长 |
|---|---|---|
| 工作日白天空闲 | 理论学习、文档阅读、Coze 实操 | 1.5–2h |
| 晚间 | 编码、调试、组件封装 | 3–4h |
| 周末整块 | 联调、真机测试、部署、文档复盘 | 整块 |

---

## 四、面试预埋点（开发时同步记录）

1. 为什么用 SSE 而不是 WebSocket 做 LLM 流式输出？
2. 为什么加 Nuxt ServerAPI 代理层，不让前端直连 Coze？（密钥安全）
3. iOS WKWebView 下 SSE 断流的现象、原因、降级思路
4. 多语言方案：前端语种如何透传大模型、动态修改 system prompt
5. APP 内嵌 H5 适配要点、容器环境与普通浏览器差异

---

## 五、明确不投入的内容（边界）

- Nuxt SEO、PWA、Nuxt Content、静态站点、复杂第三方表单组件
- Python / FastAPI / Milvus / LangChain → 放到第 2 个月

---

## 六、技术栈速查

| 类别 | 选型 |
|---|---|
| 框架 | Nuxt 4（计划为 Nuxt3，本仓库已升 4.6） |
| UI 库 | shadcn-vue |
| 状态 | pinia |
| 多语言 | @nuxtjs/i18n |
| 流式 | 自封装 `useSse` + Server API 代理 |
| AI 平台 | Coze OpenAPI |
| 部署 | Docker / Vercel / 轻量云 |
| 包管理 | pnpm |
