-- 记录周期改为：醒来 → 入睡；历史记录均视为已喂养
ALTER TABLE feeding_records RENAME COLUMN feed_time TO wake_time;

ALTER TABLE feeding_records
ADD COLUMN is_fed INTEGER NOT NULL DEFAULT 1 CHECK (is_fed IN (0, 1));

DROP INDEX IF EXISTS idx_feeding_feed_time;
CREATE INDEX IF NOT EXISTS idx_feeding_wake_time
ON feeding_records (wake_time);
