-- 每条记录 = 一个喂养周期：喂奶（即从上一周期醒来）→ 入睡；睡眠时长 = 下一条的喂奶时间 - 本条睡觉时间
-- 时间字段均为 UTC 毫秒时间戳
CREATE TABLE IF NOT EXISTS feeding_records (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  feed_time      INTEGER NOT NULL,
  feed_type      TEXT    NOT NULL DEFAULT 'breast'
                         CHECK (feed_type IN ('breast', 'formula', 'mixed')),
  breast_side    TEXT    CHECK (breast_side IN ('left', 'right', 'both')),
  formula_ml     INTEGER NOT NULL DEFAULT 0,
  feed_minutes   INTEGER,
  diaper_changed INTEGER NOT NULL DEFAULT 0,
  pooped         INTEGER NOT NULL DEFAULT 0,
  sleep_time     INTEGER NOT NULL,
  remark         TEXT,
  created_at     TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at     TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_feeding_feed_time
ON feeding_records (feed_time);