import { Router } from "express";
import { pool } from "../db/client";

const router = Router();

router.get("/", async (_req, res) => {
  const result = await pool.query(
    "SELECT * FROM channels ORDER BY name ASC"
  );
  res.json(result.rows);
});

export default router;
