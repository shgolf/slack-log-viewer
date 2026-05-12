CREATE TABLE IF NOT EXISTS channels (
  id         SERIAL PRIMARY KEY,
  slack_id   TEXT UNIQUE NOT NULL,
  name       TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id         SERIAL PRIMARY KEY,
  channel_id INTEGER REFERENCES channels(id) ON DELETE CASCADE,
  slack_ts   TEXT NOT NULL,
  user_id    TEXT,
  username   TEXT,
  text       TEXT,
  posted_at  TIMESTAMPTZ NOT NULL,
  synced_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(channel_id, slack_ts)
);

CREATE INDEX IF NOT EXISTS idx_messages_channel_id ON messages(channel_id);
CREATE INDEX IF NOT EXISTS idx_messages_posted_at  ON messages(posted_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_text       ON messages USING gin(to_tsvector('simple', coalesce(text, '')));
