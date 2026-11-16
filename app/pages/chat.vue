<script setup lang="ts">
type Message = {
  id: number;
  role: "user" | "assistant";
  text: string;
};

type ChatResponse = {
  reply: string;
};

useHead({
  title: "消息闭环 · Nuxt 聊天练习",
  htmlAttrs: { lang: "zh-CN" },
  meta: [
    {
      name: "description",
      content: "一个用 Nuxt 页面和真实服务端接口完成的模拟聊天练习。",
    },
  ],
});

const messages = ref<Message[]>([
  {
    id: 1,
    role: "assistant",
    text: "你好！发一句话给我，我会通过 Nuxt 服务端接口返回模拟回复。",
  },
]);
const draft = ref("");
const pending = ref(false);
const errorMessage = ref("");
const messagesEl = ref<HTMLElement | null>(null);
const inputEl = ref<HTMLTextAreaElement | null>(null);
let nextId = 2;

async function scrollToLatest() {
  await nextTick();
  messagesEl.value?.scrollTo({
    top: messagesEl.value.scrollHeight,
    behavior: "auto",
  });
}

function handleEnter(event: KeyboardEvent) {
  // 中文输入法确认候选词时的 Enter 不应发送消息。
  if (event.isComposing || event.keyCode === 229) return;
  event.preventDefault();
  void sendMessage();
}

async function sendMessage() {
  const message = draft.value.trim();
  if (!message || pending.value) return;

  errorMessage.value = "";
  messages.value.push({ id: nextId++, role: "user", text: message });
  draft.value = "";
  pending.value = true;
  await scrollToLatest();

  try {
    const result = await $fetch<ChatResponse>("/api/chat", {
      method: "POST",
      body: { message },
    });
    messages.value.push({
      id: nextId++,
      role: "assistant",
      text: result.reply,
    });
  } catch (error: unknown) {
    // Nuxt 的错误响应中，业务提示放在 response.data.message。
    const response = (error as { data?: { data?: { message?: string } } }).data;
    errorMessage.value =
      response?.data?.message || "请求失败，请检查服务后重试。";
  } finally {
    pending.value = false;
    await scrollToLatest();
    if (document.activeElement === document.body) inputEl.value?.focus();
  }
}
</script>

<template>
  <main class="chat-page">
    <section class="chat-shell" aria-label="Nuxt 假聊天练习">
      <header class="chat-header">
        <div class="header-copy">
          <p class="eyebrow">NUXT PRACTICE / 01</p>
          <h1>消息闭环</h1>
          <p class="subtitle">从输入到接口响应，逐步看懂一次请求</p>
        </div>
        <div class="status"><span class="status-dot" />本地模拟接口</div>
      </header>

      <div
        ref="messagesEl"
        class="messages"
        aria-live="polite"
        aria-label="聊天记录"
      >
        <div class="day-marker"><span />今天的练习<span /></div>
        <article
          v-for="message in messages"
          :key="message.id"
          class="message-row"
          :class="`message-row--${message.role}`"
        >
          <div
            v-if="message.role === 'assistant'"
            class="avatar avatar--assistant"
            aria-hidden="true"
          >
            N
          </div>
          <div class="message-content">
            <span class="message-author">{{
              message.role === "user" ? "我" : "Nuxt 助手"
            }}</span>
            <p class="bubble" :class="`bubble--${message.role}`">
              {{ message.text }}
            </p>
          </div>
          <div
            v-if="message.role === 'user'"
            class="avatar avatar--user"
            aria-hidden="true"
          >
            我
          </div>
        </article>

        <article
          v-if="pending"
          class="message-row message-row--assistant"
          aria-label="助手正在回复"
        >
          <div class="avatar avatar--assistant" aria-hidden="true">N</div>
          <div class="message-content">
            <span class="message-author">Nuxt 助手 · 正在处理</span>
            <div class="typing-bubble"><span /><span /><span /></div>
          </div>
        </article>
      </div>

      <div class="composer-area">
        <p v-if="errorMessage" class="error-banner" role="alert">
          <span class="error-mark">!</span>
          {{ errorMessage }}
        </p>
        <form class="composer" @submit.prevent="sendMessage">
          <label class="sr-only" for="chat-input">输入消息</label>
          <textarea
            id="chat-input"
            ref="inputEl"
            v-model="draft"
            rows="1"
            maxlength="500"
            placeholder="试着输入：你好"
            :disabled="pending"
            @keydown.enter.exact="handleEnter"
          />
          <div class="composer-footer">
            <span class="input-hint"
              ><kbd>Enter</kbd> 发送 <span class="hint-divider">·</span> 最多
              500 字</span
            >
            <button
              class="send-button"
              type="submit"
              :disabled="pending || !draft.trim()"
              aria-label="发送消息"
              title="发送消息"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </form>
        <div class="exercise-note">
          <span class="note-line" />
          <span>试试 <code>/error</code>，看看请求失败时页面如何处理</span>
          <span class="note-line" />
        </div>
      </div>

      <footer class="chat-footer">
        <span>Nuxt 页面</span><span class="footer-arrow">→</span
        ><span><code>/api/chat</code></span
        ><span class="footer-arrow">→</span><span>模拟回复</span>
      </footer>
    </section>
  </main>
</template>

<style>
:root {
  color-scheme: dark;
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
  background: #111318;
  color: #eef0f4;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}
body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}
button,
textarea {
  font: inherit;
}
.chat-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px 22px;
  background:
    radial-gradient(ellipse at 50% 0%, rgba(67, 74, 94, 0.18), transparent 48%),
    #111318;
}
.chat-shell {
  width: min(100%, 820px);
  height: min(780px, calc(100vh - 64px));
  min-height: 580px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #30343d;
  border-radius: 10px;
  background: #181b21;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.28);
}
.chat-header {
  min-height: 94px;
  padding: 21px 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #2b2f37;
}
.eyebrow {
  margin: 0 0 7px;
  color: #a4acc0;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.2px;
}
h1 {
  margin: 0;
  font-size: 19px;
  font-weight: 650;
  letter-spacing: 0;
}
.subtitle {
  margin: 5px 0 0;
  color: #949aa7;
  font-size: 12px;
}
.status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #aeb4c0;
  font-size: 11px;
  white-space: nowrap;
}
.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #71c69a;
  box-shadow: 0 0 0 3px rgba(113, 198, 154, 0.12);
}
.messages {
  flex: 1;
  overflow-y: auto;
  padding: 25px 30px;
  scrollbar-color: #444a56 transparent;
  scroll-behavior: smooth;
}
.day-marker {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 2px 0 28px;
  color: #777e8b;
  font-size: 10px;
}
.day-marker span {
  width: 34px;
  height: 1px;
  background: #30343d;
}
.message-row {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  margin: 0 0 22px;
}
.message-row--user {
  justify-content: flex-end;
}
.avatar {
  width: 30px;
  height: 30px;
  flex: 0 0 30px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
}
.avatar--assistant {
  background: #3c3489;
  color: #dedbff;
}
.avatar--user {
  background: #315f52;
  color: #d9f2e8;
}
.message-content {
  max-width: min(78%, 540px);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
}
.message-row--user .message-content {
  align-items: flex-end;
}
.message-author {
  color: #9ba1ad;
  font-size: 10px;
}
.bubble {
  margin: 0;
  padding: 11px 14px;
  border: 1px solid #30343d;
  border-radius: 3px 12px 12px 12px;
  background: #21252d;
  color: #e5e7eb;
  font-size: 13px;
  line-height: 1.7;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}
.bubble--user {
  border-color: #364c45;
  border-radius: 12px 3px 12px 12px;
  background: #24342f;
}
.typing-bubble {
  height: 37px;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 0 14px;
  border: 1px solid #30343d;
  border-radius: 3px 12px 12px 12px;
  background: #21252d;
}
.typing-bubble span {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #a7a1e8;
  animation: blink 1s ease-in-out infinite;
}
.typing-bubble span:nth-child(2) {
  animation-delay: 0.15s;
}
.typing-bubble span:nth-child(3) {
  animation-delay: 0.3s;
}
@keyframes blink {
  0%,
  60%,
  100% {
    opacity: 0.35;
    transform: translateY(0);
  }
  30% {
    opacity: 1;
    transform: translateY(-3px);
  }
}
.composer-area {
  padding: 0 28px 17px;
}
.error-banner {
  display: flex;
  align-items: center;
  gap: 9px;
  margin: 0 0 10px;
  padding: 10px 12px;
  border: 1px solid #653e42;
  border-radius: 6px;
  background: #382427;
  color: #f0b9b8;
  font-size: 12px;
  line-height: 1.5;
}
.error-mark {
  width: 17px;
  height: 17px;
  flex: 0 0 17px;
  display: grid;
  place-items: center;
  border: 1px solid #bd706e;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 700;
}
.composer {
  padding: 10px 12px 9px 14px;
  border: 1px solid #3a3f49;
  border-radius: 8px;
  background: #20232a;
  transition: border-color 0.18s ease;
}
.composer:focus-within {
  border-color: #7770c7;
}
.composer textarea {
  width: 100%;
  min-height: 36px;
  max-height: 100px;
  resize: vertical;
  border: 0;
  outline: 0;
  background: transparent;
  color: #eef0f4;
  font-size: 13px;
  line-height: 1.6;
}
.composer textarea::placeholder {
  color: #a0a7b4;
}
.composer textarea:disabled {
  opacity: 0.6;
}
.composer-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.input-hint {
  color: #a0a7b4;
  font-size: 10px;
}
kbd {
  padding: 2px 5px;
  border: 1px solid #454a54;
  border-radius: 3px;
  background: #292d35;
  color: #b3b9c5;
  font-family: inherit;
  font-size: 9px;
}
.hint-divider {
  padding: 0 4px;
  color: #555c68;
}
.send-button {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 6px;
  background: #554da5;
  color: white;
  cursor: pointer;
  transition:
    background 0.15s ease,
    opacity 0.15s ease;
}
.send-button:hover:not(:disabled) {
  background: #665dbb;
}
.send-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.send-button svg {
  width: 17px;
  height: 17px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.exercise-note {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 13px;
  color: #a0a7b4;
  font-size: 10px;
}
.note-line {
  height: 1px;
  flex: 1;
  background: #2b2f37;
}
code {
  color: #c0baff;
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: 0.95em;
}
.chat-footer {
  min-height: 39px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-top: 1px solid #2b2f37;
  color: #a0a7b4;
  font-size: 10px;
}
.chat-footer code {
  color: #9b94dc;
}
.footer-arrow {
  color: #555b67;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
@media (max-width: 600px) {
  .chat-page {
    min-height: 100dvh;
    padding: 0;
  }
  .chat-shell {
    width: 100%;
    height: 100dvh;
    min-height: 480px;
    border: 0;
    border-radius: 0;
  }
  .chat-header {
    min-height: 82px;
    padding: 16px 18px;
  }
  .subtitle {
    max-width: 220px;
    line-height: 1.5;
  }
  .status {
    font-size: 10px;
  }
  .messages {
    padding: 21px 17px;
  }
  .composer-area {
    padding: 0 15px 12px;
  }
  .chat-footer {
    min-height: 36px;
    gap: 7px;
    font-size: 9px;
  }
}
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
