import { Router } from "express";
import { pool } from "../db/client";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM channels ORDER BY name ASC");
    res.json(result.rows);
  } catch (e) {
    console.error("[channels]", e);
    res.status(500).json({ error: String(e) });
  }
});

export default router;
