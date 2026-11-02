import { Hono } from 'hono'

export type Env = {
  DB: D1Database
  API_TOKEN?: string
}

type FeedType = 'breast' | 'formula' | 'mixed'
const FEED_TYPES: readonly string[] = ['breast', 'formula', 'mixed']
type BreastSide = 'left' | 'right' | 'both'
const BREAST_SIDES: readonly string[] = ['left', 'right', 'both']

type RecordRow = {
  id: number
  feed_time: number
  feed_type: FeedType
  breast_side: BreastSide | null
  formula_ml: number
  feed_minutes: number | null
  diaper_changed: number
  pooped: number
  sleep_time: number
  remark: string | null
  created_at: string
  updated_at: string
}

type RecordWithNext = RecordRow & { next_feed_time: number | null }

type RecordInput = Omit<RecordRow, 'id' | 'created_at' | 'updated_at'>

type DayStat = {
  date: string
  feedCount: number
  breastCount: number
  formulaCount: number
  mixedCount: number
  formulaMl: number
  feedMinutes: number
  diaperCount: number
  poopCount: number
  sleepMinutes: number
  longestSleepMinutes: number
  avgIntervalMinutes: number
}

const MINUTE = 60_000
const DAY = 24 * 60 * MINUTE

// 用窗口函数取下一条的喂奶时间，用于计算本条的睡眠时长 / 喂奶间隔
const SELECT_WITH_NEXT = `SELECT * FROM (
  SELECT r.*, LEAD(feed_time) OVER (ORDER BY feed_time, id) AS next_feed_time FROM feeding_records r
)`

const router = new Hono<{ Bindings: Env }>()

function clampInt(raw: string | undefined, min: number, max: number, fallback: number): number {
  const n = Number(raw)
  if (raw === undefined || raw === '' || !Number.isInteger(n)) return fallback
  return Math.min(Math.max(n, min), max)
}

function parseId(raw: string): number | null {
  const id = Number(raw)
  return Number.isInteger(id) && id > 0 ? id : null
}

function parseInput(body: unknown): RecordInput | string {
  if (!body || typeof body !== 'object') return '请求体无效'
  const b = body as Record<string, unknown>

  const feedTime = Number(b.feed_time)
  const sleepTime = Number(b.sleep_time)
  if (!Number.isInteger(feedTime) || feedTime <= 0) return '喂奶时间无效'
  if (!Number.isInteger(sleepTime) || sleepTime <= 0) return '睡觉时间无效'
  if (sleepTime < feedTime) return '睡觉时间不能早于喂奶时间'

  const feedType = b.feed_type ?? 'breast'
  if (typeof feedType !== 'string' || !FEED_TYPES.includes(feedType)) return '喂养方式无效'

  let breastSide: BreastSide | null = null
  if (feedType !== 'formula' && b.breast_side !== null && b.breast_side !== undefined && b.breast_side !== '') {
    if (typeof b.breast_side !== 'string' || !BREAST_SIDES.includes(b.breast_side)) return '母乳喂养侧无效'
    breastSide = b.breast_side as BreastSide
  }

  const formulaMl = feedType === 'breast' ? 0 : Number(b.formula_ml ?? 0)
  if (!Number.isFinite(formulaMl) || formulaMl < 0 || formulaMl > 1000) return '奶粉量无效'

  let feedMinutes: number | null = null
  if (b.feed_minutes !== null && b.feed_minutes !== undefined && b.feed_minutes !== '') {
    feedMinutes = Number(b.feed_minutes)
    if (!Number.isFinite(feedMinutes) || feedMinutes < 0 || feedMinutes > 600) return '喂养时长无效'
    feedMinutes = Math.round(feedMinutes)
  }

  const remark = typeof b.remark === 'string' ? b.remark.trim().slice(0, 200) : ''

  return {
    feed_time: feedTime,
    feed_type: feedType as FeedType,
    breast_side: breastSide,
    formula_ml: Math.round(formulaMl),
    feed_minutes: feedMinutes,
    diaper_changed: b.diaper_changed ? 1 : 0,
    pooped: b.pooped ? 1 : 0,
    sleep_time: sleepTime,
    remark: remark || null,
  }
}

// 分页列表（按喂奶时间倒序），before 为游标
router.get('/records', async (c) => {
  const before = clampInt(c.req.query('before'), 0, Number.MAX_SAFE_INTEGER, 0)
  const limit = clampInt(c.req.query('limit'), 1, 200, 50)
  const stmt = before > 0
    ? c.env.DB.prepare(`${SELECT_WITH_NEXT} WHERE feed_time < ? ORDER BY feed_time DESC, id DESC LIMIT ?`).bind(before, limit)
    : c.env.DB.prepare(`${SELECT_WITH_NEXT} ORDER BY feed_time DESC, id DESC LIMIT ?`).bind(limit)
  const { results } = await stmt.all<RecordWithNext>()
  return c.json({ code: 200, msg: 'ok', data: { records: results, hasMore: results.length === limit } })
})

router.post('/records', async (c) => {
  const input = parseInput(await c.req.json().catch(() => null))
  if (typeof input === 'string') return c.json({ code: 400, msg: input }, 400)

  const row = await c.env.DB.prepare(
    `INSERT INTO feeding_records (feed_time, feed_type, breast_side, formula_ml, feed_minutes, diaper_changed, pooped, sleep_time, remark)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`
  )
    .bind(input.feed_time, input.feed_type, input.breast_side, input.formula_ml, input.feed_minutes, input.diaper_changed, input.pooped, input.sleep_time, input.remark)
    .first<{ id: number }>()
  return c.json({ code: 200, msg: '保存成功', data: { id: row?.id } })
})

router.put('/records/:id', async (c) => {
  const id = parseId(c.req.param('id'))
  if (!id) return c.json({ code: 400, msg: 'id 无效' }, 400)
  const input = parseInput(await c.req.json().catch(() => null))
  if (typeof input === 'string') return c.json({ code: 400, msg: input }, 400)

  const res = await c.env.DB.prepare(
    `UPDATE feeding_records SET feed_time = ?, feed_type = ?, breast_side = ?, formula_ml = ?, feed_minutes = ?, diaper_changed = ?,
       pooped = ?, sleep_time = ?, remark = ?, updated_at = datetime('now') WHERE id = ?`
  )
    .bind(input.feed_time, input.feed_type, input.breast_side, input.formula_ml, input.feed_minutes, input.diaper_changed, input.pooped, input.sleep_time, input.remark, id)
    .run()
  if (!res.meta.changes) return c.json({ code: 404, msg: '记录不存在' }, 404)
  return c.json({ code: 200, msg: '更新成功', data: { id } })
})

router.delete('/records/:id', async (c) => {
  const id = parseId(c.req.param('id'))
  if (!id) return c.json({ code: 400, msg: 'id 无效' }, 400)
  const res = await c.env.DB.prepare('DELETE FROM feeding_records WHERE id = ?').bind(id).run()
  if (!res.meta.changes) return c.json({ code: 404, msg: '记录不存在' }, 404)
  return c.json({ code: 200, msg: '删除成功', data: { id } })
})

// 按天统计；tz 为客户端时区相对 UTC 的偏移分钟数（东八区 = 480）
router.get('/stats', async (c) => {
  const days = clampInt(c.req.query('days'), 1, 90, 7)
  const tz = clampInt(c.req.query('tz'), -840, 840, 480)
  const offset = tz * MINUTE
  const now = Date.now()
  const todayStart = Math.floor((now + offset) / DAY) * DAY - offset
  const rangeStart = todayStart - (days - 1) * DAY
  const rangeEnd = todayStart + DAY

  // 区间内的记录 + 区间开始前、睡眠跨入区间的那条记录
  const [{ results: rows }, last] = await Promise.all([
    c.env.DB.prepare(
      `${SELECT_WITH_NEXT} WHERE feed_time < ? AND (feed_time >= ? OR next_feed_time IS NULL OR next_feed_time > ?) ORDER BY feed_time, id`
    )
      .bind(rangeEnd, rangeStart, rangeStart)
      .all<RecordWithNext>(),
    c.env.DB.prepare('SELECT * FROM feeding_records ORDER BY feed_time DESC, id DESC LIMIT 1').first<RecordRow>(),
  ])

  const buckets = Array.from({ length: days }, (_, i) => ({
    date: new Date(rangeStart + i * DAY + offset).toISOString().slice(0, 10),
    feedCount: 0,
    breastCount: 0,
    formulaCount: 0,
    mixedCount: 0,
    formulaMl: 0,
    feedMinutes: 0,
    diaperCount: 0,
    poopCount: 0,
    sleepMs: 0,
    longestSleepMs: 0,
    intervalMs: 0,
    intervalCount: 0,
  }))
  const bucketOf = (ms: number) => buckets[Math.floor((ms - rangeStart) / DAY)]

  for (const r of rows) {
    if (r.feed_time >= rangeStart) {
      const b = bucketOf(r.feed_time)
      if (b) {
        b.feedCount++
        if (r.feed_type === 'breast') b.breastCount++
        else if (r.feed_type === 'formula') b.formulaCount++
        else b.mixedCount++
        b.formulaMl += r.formula_ml
        b.feedMinutes += r.feed_minutes ?? 0
        b.diaperCount += r.diaper_changed
        b.poopCount += r.pooped
        if (r.next_feed_time !== null) {
          b.intervalMs += r.next_feed_time - r.feed_time
          b.intervalCount++
        }
      }
    }

    // 最后一条记录若已入睡，则视为睡到现在
    const sleepEnd = r.next_feed_time ?? now
    if (sleepEnd <= r.sleep_time) continue
    if (r.sleep_time >= rangeStart) {
      const b = bucketOf(r.sleep_time)
      if (b) b.longestSleepMs = Math.max(b.longestSleepMs, sleepEnd - r.sleep_time)
    }
    // 跨天的睡眠按天拆分
    let s = Math.max(r.sleep_time, rangeStart)
    const e = Math.min(sleepEnd, rangeEnd)
    while (s < e) {
      const i = Math.floor((s - rangeStart) / DAY)
      const segEnd = Math.min(e, rangeStart + (i + 1) * DAY)
      const b = buckets[i]
      if (b) b.sleepMs += segEnd - s
      s = segEnd
    }
  }

  const daily: DayStat[] = buckets.map((b) => ({
    date: b.date,
    feedCount: b.feedCount,
    breastCount: b.breastCount,
    formulaCount: b.formulaCount,
    mixedCount: b.mixedCount,
    formulaMl: b.formulaMl,
    feedMinutes: b.feedMinutes,
    diaperCount: b.diaperCount,
    poopCount: b.poopCount,
    sleepMinutes: Math.round(b.sleepMs / MINUTE),
    longestSleepMinutes: Math.round(b.longestSleepMs / MINUTE),
    avgIntervalMinutes: b.intervalCount ? Math.round(b.intervalMs / b.intervalCount / MINUTE) : 0,
  }))

  // 日均值只按有记录的天数计算
  const active = daily.filter((d) => d.feedCount > 0)
  const sum = (key: keyof Omit<DayStat, 'date'>) => daily.reduce((acc, d) => acc + d[key], 0)
  const avg = (key: keyof Omit<DayStat, 'date'>) =>
    active.length ? Math.round((active.reduce((acc, d) => acc + d[key], 0) / active.length) * 10) / 10 : 0
  const intervalCount = buckets.reduce((acc, b) => acc + b.intervalCount, 0)

  const summary = {
    activeDays: active.length,
    totalFeeds: sum('feedCount'),
    breastCount: sum('breastCount'),
    formulaCount: sum('formulaCount'),
    mixedCount: sum('mixedCount'),
    totalFormulaMl: sum('formulaMl'),
    avgFeedCount: avg('feedCount'),
    avgFormulaMl: avg('formulaMl'),
    avgFeedMinutes: avg('feedMinutes'),
    avgSleepMinutes: avg('sleepMinutes'),
    avgDiaperCount: avg('diaperCount'),
    avgPoopCount: avg('poopCount'),
    avgIntervalMinutes: intervalCount
      ? Math.round(buckets.reduce((acc, b) => acc + b.intervalMs, 0) / intervalCount / MINUTE)
      : 0,
    longestSleepMinutes: Math.max(0, ...daily.map((d) => d.longestSleepMinutes)),
  }

  return c.json({
    code: 200,
    msg: 'ok',
    data: { rangeStart, rangeEnd, now, daily, summary, last: last ?? null },
  })
})

export default router
