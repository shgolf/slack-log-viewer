import { Router } from "express";
import { pool } from "../db/client";
import { fetchAllChannels, fetchMessages } from "../slack/client";

const router = Router();

const INITIAL_DAYS = 90;
const INCREMENTAL_HOURS = 48;

async function runSync(_req: any, res: any) {
  try {
  const channels = await fetchAllChannels();

  let totalInserted = 0;
  const skipped: string[] = [];
  const errors: { channel: string; error: string }[] = [];

  for (const ch of channels) {
    if (!ch.id || !ch.name) continue;

    const { rows: upserted } = await pool.query(
      `INSERT INTO channels (slack_id, name)
       VALUES ($1, $2)
       ON CONFLICT (slack_id) DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
      [ch.id, ch.name]
    );
    const channelDbId: number = upserted[0].id;

    const hasMessages = await pool.query(
      "SELECT 1 FROM messages WHERE channel_id = $1 LIMIT 1",
      [channelDbId]
    );
    const oldest = hasMessages.rows.length === 0
      ? String(Date.now() / 1000 - INITIAL_DAYS * 24 * 60 * 60)
      : String(Date.now() / 1000 - INCREMENTAL_HOURS * 60 * 60);

    let messages;
    try {
      messages = await fetchMessages(ch.id, oldest);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`[sync] skip #${ch.name}: ${msg}`);
      if (msg.includes("not_in_channel")) {
        skipped.push(ch.name);
      } else {
        errors.push({ channel: ch.name, error: msg });
      }
      continue;
    }

    for (const msg of messages) {
      const postedAt = new Date(Number(msg.ts) * 1000).toISOString();
      await pool.query(
        `INSERT INTO messages (channel_id, slack_ts, user_id, username, text, posted_at)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (channel_id, slack_ts) DO NOTHING`,
        [channelDbId, msg.ts, msg.user ?? null, msg.username ?? null, msg.text ?? null, postedAt]
      );
      totalInserted++;
    }
  }

  res.json({ ok: true, inserted: totalInserted, skipped, errors });
  } catch (e) {
    console.error("[sync] fatal:", e);
    res.status(500).json({ error: String(e) });
  }
}

router.get("/", runSync);
router.post("/", runSync);

export default router;
