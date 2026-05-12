import { Router } from "express";
import { pool } from "../db/client";
import type { MessagesQuery } from "../types";

const router = Router();

router.get("/", async (req, res) => {
  const { channel_id, keyword, date_from, date_to, limit = "50", offset = "0" } =
    req.query as MessagesQuery;

  const conditions: string[] = [];
  const params: unknown[] = [];

  if (channel_id) {
    params.push(Number(channel_id));
    conditions.push(`m.channel_id = $${params.length}`);
  }

  if (date_from) {
    params.push(date_from);
    conditions.push(`m.posted_at >= $${params.length}`);
  }

  if (date_to) {
    params.push(date_to);
    conditions.push(`m.posted_at <= $${params.length}`);
  }

  if (keyword) {
    params.push(`%${keyword}%`);
    conditions.push(`m.text ILIKE $${params.length}`);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  params.push(Number(limit));
  const limitClause = `LIMIT $${params.length}`;

  params.push(Number(offset));
  const offsetClause = `OFFSET $${params.length}`;

  const query = `
    SELECT m.*, c.name AS channel_name
    FROM messages m
    JOIN channels c ON c.id = m.channel_id
    ${where}
    ORDER BY m.posted_at DESC
    ${limitClause} ${offsetClause}
  `;

  const countQuery = `SELECT COUNT(*) FROM messages m ${where}`;

  const [rows, count] = await Promise.all([
    pool.query(query, params),
    pool.query(countQuery, params.slice(0, params.length - 2)),
  ]);

  res.json({ total: Number(count.rows[0].count), messages: rows.rows });
});

export default router;
