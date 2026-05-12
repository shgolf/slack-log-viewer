import dotenv from "dotenv";
dotenv.config();

import express from "express";
import fs from "fs";
import path from "path";
import { app } from "../../api/app";
import { pool } from "../../api/db/client";

const PORT = process.env.PORT ?? 3001;

const frontendDist = path.join(__dirname, "../../frontend/dist");
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get("*", (_req, res) => res.sendFile(path.join(frontendDist, "index.html")));
}

async function runMigrations() {
  const sql = fs.readFileSync(
    path.join(__dirname, "../../api/db/migrations/001_initial.sql"),
    "utf-8"
  );
  await pool.query(sql);
  console.log("Migrations applied.");
}

runMigrations().then(() => {
  app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));
});
