export default defineEventHandler(async (event) => {
  // 1. 读取浏览器通过 POST /api/chat 发来的 JSON。
  const body = await readBody<{ message?: unknown }>(event)

  if (typeof body?.message !== 'string' || !body.message.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Message is required', data: { message: '请输入消息后再发送。' } })
  }

  const message = body.message.trim()
  if (message.length > 500) {
    throw createError({ statusCode: 400, statusMessage: 'Message is too long', data: { message: '消息最多 500 个字符。' } })
  }

  // 2. 模拟处理耗时，让页面可以展示等待状态；这里没有调用 AI。
  await new Promise((resolve) => setTimeout(resolve, 700))

  // 输入这条指令可以真实触发 HTTP 500，练习前端的 catch 分支。
  if (message === '/error') {
    throw createError({ statusCode: 500, statusMessage: 'Demo error', data: { message: '这是主动触发的模拟错误。接口已恢复，可以重新发送。' } })
  }

  // 3. 返回 JSON。以后可以把这里替换为调用大模型的代码。
  return { reply: `收到你的消息：${message}` }
})
