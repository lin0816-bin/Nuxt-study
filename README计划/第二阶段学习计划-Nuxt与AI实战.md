# 第二阶段学习计划｜Nuxt × RAG 实战合并（8 周 / 56 天）

> 生成日期：2026-11-10
> 依据：`README计划/五个月蜕变计划.md`、`Nuxt每日任务清单.md`（已结项）、本人当前进度
> 当前状态：✅ Nuxt 课程全部学完 ✅ 提示词工程 ✅ Ollama 本地模型 ✅ Python 基础
> 下一步定位：**不再把 Nuxt 和 AI 分成两条线，用一个项目同时收口两条线**
> 目标产出：`Nuxt × RAG 智能知识库问答站`（可线上演示、可写进简历的端到端项目）

---

## 一、为什么改成"合并"而不是按原计划走

| 原计划（五个月蜕变计划） | 现实变化 | 调整 |
|---|---|---|
| Month 1：Nuxt + Coze 做 V0 | Nuxt 已学完；Coze 没学过，且不是必需 | V0 的 AI 端改用 **Ollama / DeepSeek API**，Coze 降级为可选体验 |
| Month 2：FastAPI + SpringBoot 双线后端 | 只会 Python 基础，直接压 SpringBoot 容易两头都浅 | 先只做 **FastAPI 最小可用版**，SpringBoot 留到 V3 阶段 |
| Month 3：RAG / Milvus / LangGraph（王牌 V2） | 已具备提示词 + Ollama + Python 基础，黑马 RAG/Agent 课可以直接开 | **RAG 主线提前到本阶段第 3~5 周**，先做透核心链路 |
| 全程：Nuxt 前端由 V0→V3 逐步迭代 | 缺一个"能把 Nuxt 用起来"的实战项目 | 前 2 周先做 Nuxt 毕业项目（V0-lite），后 6 周给它接上真后端 |

**三条设计理由**

1. **省一次返工**：Nuxt 的毕业项目本来就要有个后端能聊天，与其先接 Coze 做一遍、Month 2 再推倒换 FastAPI，不如第一版就按"将来能换成 RAG 后端"的形状设计（`/api/chat` 代理层 + `useSse`），后端换掉时前端零改动。
2. **简历故事更顺**：最终是一条 `V0-lite 流式对话 → 本地 Ollama 接入 → LangChain RAG → 可视化调试面板 → Docker 一键部署` 的演进线，比"先做完一个 Coze 玩具再另起炉灶"更像真实工程迭代。
3. **成本可控**：课程里的模型调用全部指到本地 Ollama（`http://localhost:11434/v1`），零 API 费用；只在最后对比效果时临时用一次线上模型。

⚠️ **范围红线**：本阶段**不做** SpringBoot / 微服务 / vLLM / Milvus 集群。向量库先用 **Chroma**（本地文件、零运维），等链路跑通再换 Milvus（那是 Month 3 的进阶内容）。先做深，再做宽。

---

## 二、项目形态与技术栈

### 目标项目：Nuxt × RAG 智能知识库问答站

```
┌─ Nuxt 4 前端 ────────────────────────────────────┐
│ app/pages/        对话页 / 知识库管理页 / 调试面板   │
│ app/composables/  useSse（流式、心跳、重连）        │
│ app/stores/       pinia 会话管理                   │
│ @nuxtjs/i18n      zh / en，语种透传大模型           │
└──────────────────────┬───────────────────────────┘
                       │ $fetch / SSE，密钥不出浏览器
┌──────────────────────▼───────────────────────────┐
│ Nuxt Server API（代理层 / 安全边界）                │
│ /api/chat  /api/upload  /api/ingest  /api/debug    │
│ runtimeConfig 存后端地址与密钥                      │
└──────────────────────┬───────────────────────────┘
                       │ HTTP + SSE
┌──────────────────────▼───────────────────────────┐
│ FastAPI + LangChain（Python AI 服务）               │
│ Loader → Splitter → Embedding → Chroma → Retriever │
│ → (Rerank) → Prompt → LLM → 流式输出 + 引用来源     │
└──────────────────────┬───────────────────────────┘
                       │ OpenAI 兼容接口
        Ollama  localhost:11434/v1（默认）
        或 DeepSeek API（效果对比时切换）
```

| 层 | 选型 | 说明 |
|---|---|---|
| 前端 | Nuxt 4（本仓库 4.6+，源码根 `app/`） | 与已学内容一致，直接复用 |
| UI / 状态 | shadcn-vue + pinia | 沿用 Month 1 计划 |
| 流式 | 自封装 `useSse` + Server 代理 | 面试预埋点之一 |
| 多语言 | `@nuxtjs/i18n` | 语种注入 system prompt |
| AI 服务 | Python 3.13 + FastAPI + LangChain | 黑马课程主线 |
| 向量库 | Chroma（本地持久化） | 先跑通，Month 3 再换 Milvus |
| 模型 | Ollama（对话 + `nomic-embed-text` 向量） | 省钱、可离线、可写进"私有化"故事 |
| 交付 | Docker Compose 一键编排 | Nuxt + FastAPI + Chroma（+ 可选 Ollama） |

### 前置自检（第 0 天，30 分钟）

- [ ] `pnpm install && pnpm dev` 能出页面（本仓库目前仍是最小起步模板，只有 `app/app.vue`）
- [ ] `ollama serve` 正常，且 `ollama list` 里至少有一个对话模型
- [ ] `ollama pull nomic-embed-text`（第 4 周要用，提前拉）
- [ ] Python 建好独立 venv：`python -m venv .venv`，不与全局环境混用
- [ ] 新建 `.env.example` + 把 `.env`、`.venv/`、`chroma_db/` 加进 `.gitignore`

---

## 三、8 周详细任务

> 节奏沿用旧清单：工作日白天 1.5–2h 理论/文档，晚间 3–4h 编码，周末整块联调与复盘。
> 用法同样：**每天只看自己那一行**。

### 第 1 周｜Day 1–7　Nuxt 毕业项目骨架（前端闭环）

| Day | 编码任务 | 验收 |
|---|---|---|
| 1 | 工程整理：`app/pages/index.vue` + `<NuxtPage />`，装 shadcn-vue / pinia，git 建 `feat/v0-lite` 分支 | 路由 `/`、`/about` 正常 |
| 2 | 对话页 UI：消息气泡、输入框、三点 loading、自动滚底 | 能发消息、显示假回复 |
| 3 | `app/composables/useSse.ts` 骨架：`fetch` + `ReadableStream` 解析 `data:` 帧 | 能逐字接收文本 |
| 4 | `server/api/mock-stream.post.ts` 定时推字的假流；接上打字机效果 | 页面出现流式打字机 |
| 5 | `useSse` 加心跳、指数退避重连、错误回调与 `AbortController` | 断流能恢复、能中止 |
| 6 | `@nuxtjs/i18n` 接入，zh/en 语言包 + `localStorage` 记忆，全站文案 `$t()` | 切换语言整站生效 |
| 7 | 双端布局（宽屏侧边栏 / 窄屏底部 Tab）+ WebView 适配（viewport、安全区、禁回弹）+ 周复盘提交 | 桌面/手机视口形态正确 |

**✅ 周产出**：`V0-lite 前端`——可跑的流式对话界面（用 Mock 流），Nuxt 能力全部落地。
**🚫 本周不碰**：Python、RAG、向量库、真实模型调用。

### 第 2 周｜Day 8–14　接真模型，前端项目收官

| Day | 编码任务 | 验收 |
|---|---|---|
| 8 | `nuxt.config.ts` 配 `runtimeConfig`，`.env` 存后端地址/密钥（**不提交**） | 服务端可读、前端读不到 |
| 9 | `server/api/chat.post.ts`：转发到 Ollama 的 OpenAI 兼容 `/v1/chat/completions`，`stream: true` | 能拿到真实流 |
| 10 | 把 Ollama 的 SSE 帧逐条透传前端，替换 Mock；前端 `useSse` 不改一行 | 真实模型流式回答 |
| 11 | 语种注入：前端传 `locale`，服务端拼 zh/en system prompt | 切英文 AI 用英文答 |
| 12 | 会话持久化（pinia + localStorage）、新建/重命名/删除 | 刷新不丢对话 |
| 13 | `server/api/upload.post.ts`：限制 pdf/md/txt/**srt** 类型与大小（为字幕问答预埋） | 文件能收、超限被拦 |
| 14 | 端到端走查 + 写 `踩坑记录.md` + README 初稿 + 阶段提交 | 全链路可用 |

**✅ 周产出**：**Nuxt 毕业项目完成**（真实流式问答 + 多语言 + 文件上传 + 双端 UI）。这一步做完，Nuxt "学完" 才算真正变成 "会用"。
**💡 关键设计**：代理层在这里已经把"前端 ↔ AI 后端"的契约定死了，第 6 周换成 RAG 后端只改代理层内部，前端零改动——这就是值得在面试里讲的解耦点。

### 第 3 周｜Day 15–21　LangChain 核心 + Python 工程化补强

> 📺 主课程：B站 BV1yjz5BLEoY（黑马 RAG 与 Agent 实战），**直接从 LangChain 部分切入**，跳过 Python 基础与提示词入门。

| Day | 理论 | 编码 / 验收 |
|---|---|---|
| 15 | LangChain 概览、Model I/O | `ChatOpenAI` 指到 `http://localhost:11434/v1`，跑通一次本地调用 |
| 16 | LCEL 链式表达式、PromptTemplate | 写一条 `prompt | model | parser` 链 |
| 17 | Memory / 多轮对话 | 带历史的链，能记住上一句 |
| 18 | Output Parser、结构化输出 | 让模型返回 JSON 并解析成 Pydantic 对象 |
| 19 | FastAPI 最小入门（路由 / Pydantic / 自动文档） | 写一个 `/health` 和 `/chat` 同步接口 |
| 20 | Python 虚拟环境、依赖管理、异常与日志规范 | `requirements.txt` / `pyproject.toml` 固定版本 |
| 21 | 周复盘：把本周 Demo 整理成 `ai-service/` 目录骨架 | 结构清晰、可重复运行 |

**✅ 周产出**：`ai-service/` Python 服务骨架 + LangChain 最小链，全程本地 Ollama，零 API 花费。

### 第 4 周｜Day 22–28　RAG 全流程（本阶段最核心的一周）

| Day | 理论 | 编码 / 验收 |
|---|---|---|
| 22 | RAG 原理、为什么需要检索增强 | 画出数据流向图，写进笔记 |
| 23 | Document Loader：txt / md / pdf / **srt 字幕解析** | 能载入自己的文档 |
| 24 | Text Splitter：chunk_size / overlap、按语义切分对比 | 打印分块结果，肉眼检查切得是否合理 |
| 25 | Embedding：本地 `nomic-embed-text`，理解向量与相似度 | 单条文本转向量成功 |
| 26 | Chroma 向量库：入库、持久化、collection 管理 | 文档向量可重复查询、重启不丢 |
| 27 | Retriever + TopK + 相似度阈值，拼 RAG Prompt | **命令行能对自己的文档问答** |
| 28 | 引用来源回传（source / chunk / score）+ 周复盘 | 答案能标出来自哪个文件哪一段 |

**✅ 周产出**：命令行版 RAG（"问自己的文档"跑通）。这一周是全项目的地基，**宁可多花 2 天也别赶进度**。

### 第 5 周｜Day 29–35　FastAPI 化 + Agent 初探

| Day | 任务 | 验收 |
|---|---|---|
| 29 | `/ingest` 上传入库接口（复用第 2 周的上传约束） | 传文件→自动切分→入库 |
| 30 | `/chat` 改造成 **SSE 流式**接口（`StreamingResponse`） | curl 能看到逐字输出 |
| 31 | 把 RAG 链接入 `/chat`，流式吐 token + 末尾附引用来源 | 流式答案 + 来源 |
| 32 | Agent / Function Calling 概念、ReAct 模式 | 能用一句话讲清 Agent 与普通链的区别 |
| 33 | 给 Agent 挂 1~2 个工具（如"查知识库""查时间/计算"） | 模型能自主决定调工具 |
| 34 | CORS、超时、限流、全局异常处理 | 前端能跨域调用、异常有结构化响应 |
| 35 | 周复盘 + 接口文档（FastAPI 自动生成）+ Postman/Apifox 用例 | 接口可被独立测试 |

**✅ 周产出**：可独立访问的 Python RAG 服务（`/ingest` + `/chat` SSE），并具备最小 Agent 能力。

### 第 6 周｜Day 36–42　前后端整合（两条线合并在这一周）

| Day | 任务 | 验收 |
|---|---|---|
| 36 | Nuxt `/api/chat` 代理从 Ollama 改指向 FastAPI `/chat` | 前端零改动，照样流式回答 |
| 37 | `/api/ingest` 代理 + 知识库管理页（上传、列表、删除文档） | 前端能管理知识库 |
| 38 | 答案区展示引用来源（文件名 / 片段 / 相似度） | 可点击展开原文片段 |
| 39 | **RAG 调试面板**：输入 query → 展示召回的 TopK 分块 + 打分 | 能直观看到"检索到了什么" |
| 40 | 分块预览、召回对比（调 TopK / chunk_size 即时看差异） | 参数可调、效果可对比 |
| 41 | 语种联动：检索 query 与 system prompt 都随 locale 走 | 中英文都能正确问答 |
| 42 | 端到端联调 + 联调踩坑记录 | 完整链路稳定 |

**✅ 周产出**：**项目主体完成**。调试面板是这个项目的简历亮点——多数人只会调 API，你能把 RAG 的中间过程可视化，说明真懂链路。

### 第 7 周｜Day 43–49　质量、边界与优化

- [ ] SSE 断流 / 超时 / 后端 500 的前端兜底提示（复用第 1 周 `useSse` 的错误回调）
- [ ] WebView 环境识别与轮询降级开关（对应旧计划面试点 3）
- [ ] 大文件、空文件、重复文档、非文本 pdf 的边界处理
- [ ] 检索质量优化：混合检索（关键词 + 向量）或 Rerank，用 10~20 条自造问答做小评估集，记录优化前后命中率
- [ ] Token 用量统计看板（输入/输出 token、调用次数）
- [ ] 简单评估：整理 `eval/questions.json`，跑一遍把坏案例记进踩坑表
- [ ] 性能：文档入库改为后台任务，避免上传阻塞（Celery 可留到 Month 3）

**✅ 周产出**：从"能跑"变成"敢给人演示"，并积累一批可讲优化故事的数据。

### 第 8 周｜Day 50–56　工程交付与面试转化

| Day | 任务 |
|---|---|
| 50–51 | `Dockerfile`（Nuxt 多阶段构建）+ FastAPI 镜像 + `docker-compose.yml`（Nuxt / FastAPI / Chroma / Ollama 可选） |
| 52 | 本地 `docker compose up -d` 一键起全套，验证数据卷持久化 |
| 53 | 部署拿公网演示地址（Vercel / 轻量云），手机与外网可访问 |
| 54 | README：架构图、功能截图、快速启动、部署步骤、踩坑清单、模型切换说明 |
| 55 | 写 1 分钟 / 5 分钟两版项目讲解脚本，整理 8 个面试预埋点答案 |
| 56 | 总复盘：对照五个月计划，明确下一阶段（SpringBoot / Milvus / LangGraph / vLLM）从哪接 |

**✅ 周产出**：线上演示地址 + 完整 README + 面试脚本 + 可复现的一键部署环境。

---

## 四、验收里程碑

| 节点 | 完成标志 | 对应原计划 |
|---|---|---|
| 第 1 周末 | Nuxt 前端 V0-lite 跑通（Mock 流式 + i18n + 双端 UI） | Month 1 阶段 1–2 |
| 第 2 周末 | **Nuxt 毕业项目收官**，真实 Ollama 流式问答可用 | Month 1 V0（去 Coze 版） |
| 第 4 周末 | 命令行 RAG 能对自己的文档（含 srt 字幕）问答 | Month 3 RAG 核心 |
| 第 6 周末 | 前后端整合完成，RAG 调试面板可用 | Month 3 V2 雏形 |
| 第 8 周末 | Docker Compose 一键部署 + 线上地址 + 面试稿 | 全计划交付物 |

---

## 五、面试预埋点（开发时同步写答案）

1. 为什么用 SSE 而不是 WebSocket 做 LLM 流式输出？
2. 为什么要 Nuxt Server 代理层，不让前端直连模型/AI 服务？（密钥、限流、跨域、契约解耦）
3. 后端从 Ollama 换成 RAG 服务时，前端为什么能零改动？代理层契约怎么设计的？
4. RAG 完整链路讲一遍：加载 → 清洗 → 分块 → Embedding → 入库 → 召回 → 重排 → 生成 → 引用回传
5. `chunk_size` / `overlap` 怎么调？切太大太小各有什么后果？
6. 为什么先选 Chroma 而不是 Milvus？什么情况下必须换？（数据量、多租户、分布式、并发）
7. 本地 Ollama 与线上模型 API 如何无缝切换？（OpenAI 兼容接口 + 环境变量）
8. 检索效果差怎么排查？（query 改写、TopK、阈值、混合检索、Rerank、评估集）
9. 答案幻觉怎么控制？（prompt 约束、只基于上下文作答、引用来源、无结果时拒答）
10. iOS WKWebView 下 SSE 断流的现象 / 原因 / 降级方案
11. 多语言如何透传到大模型，语种注入 system prompt 的实现位置
12. 文档入库为什么必须异步？阻塞上传会带来什么问题

---

## 六、资源与红线

**主课程**：<https://www.bilibili.com/video/BV1yjz5BLEoY/>（黑马 RAG 与 Agent 实战，LangChain 起看）
**备查**：LangChain 官方文档 · Ollama OpenAI 兼容接口文档 · FastAPI 文档 · Nuxt 4 文档

**本阶段红线**

- ❌ 不做 SpringBoot / SpringCloud / 微服务 / vLLM（留给 V3）
- ❌ 不上 Milvus 集群、Celery（Month 3 进阶再补）
- ❌ 密钥（API Key / 后端地址）绝不进前端代码、绝不提交 git
- ❌ 不沉迷 Coze 全套教程：它只是可选的低代码入门，一个周末体验即可，不占主线时间
- ❌ 不为了"学完课程"跳过第 1–2 周的 Nuxt 编码：没有实战项目，学完等于没学

**Coze 的准确定位**：不是前置、不是障碍。想快速建立"智能体由哪些能力组成"的直观感受时，抽一个周末拖一个机器人，再用 LangChain 代码实现同样功能做对照即可。

---

## 七、与五个月总计划的关系

本阶段 = **Month 1 收官 + Month 3 核心提前 + 一个贯穿的实战项目**，不推翻原计划：

| 原计划 | 本阶段处理 |
|---|---|
| Month 1 Nuxt + Coze V0 | ✅ 已完成（Coze 替换为 Ollama，功能等价且更贴近自研） |
| Month 2 FastAPI + SpringBoot | ⏩ FastAPI 最小版提前做；SpringBoot 顺延 |
| Month 3 RAG / Milvus / LangGraph / Celery | ⏩ RAG 核心链路提前吃透；Milvus / LangGraph / Celery 顺延为进阶 |
| Month 4 微服务 / vLLM V3 | ⏸ 不动 |
| Month 5 面试冲刺 | ⏸ 不动，但本阶段已提前产出演示地址与面试脚本 |

> 8 周结束后回看 `README计划/五个月蜕变计划.md`，按实际进度把 Month 2/3 的剩余项重新排期即可。
