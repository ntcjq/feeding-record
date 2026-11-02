import { Hono } from 'hono'
import feeding, { type Env } from './feeding.js'
import { pageHtml } from './page.js'

const app = new Hono<{ Bindings: Env }>()

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

app.get('/', (c) => c.html(pageHtml()))

// 页面公开，数据接口统一走 Bearer Token 鉴权
app.use('/api/*', async (c, next) => {
  const apiToken = c.env.API_TOKEN
  if (!apiToken) {
    // fail-close：未配置 token 时拒绝访问
    return c.json({ code: 503, msg: '服务未配置 API_TOKEN' }, 503)
  }
  const token = c.req.header('Authorization')?.replace(/^Bearer\s+/i, '') ?? ''
  if (!safeEqual(token, apiToken)) {
    return c.json({ code: 401, msg: '未授权，口令无效' }, 401)
  }
  return next()
})

app.get('/api/auth/check', (c) => c.json({ code: 200, msg: 'ok' }))
app.route('/api', feeding)

app.notFound((c) => c.json({ code: 404, msg: 'Not Found' }, 404))
app.onError((err, c) => {
  console.error('[onError]', err)
  return c.json({ code: 500, msg: '服务器内部错误' }, 500)
})

export default app
