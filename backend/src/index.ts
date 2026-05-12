import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { pool } from "./db/client";
import channelsRouter from "./routes/channels";
import messagesRouter from "./routes/messages";
import syncRouter from "./routes/sync";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

app.use("/api/channels", channelsRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/sync", syncRouter);

app.get("/health", (_req, res) => res.json({ ok: true }));

async function runMigrations() {
  const sql = fs.readFileSync(
    path.join(__dirname, "db/migrations/001_initial.sql"),
    "utf-8"
  );
  await pool.query(sql);
  console.log("Migrations applied.");
}

runMigrations().then(() => {
  app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));
});
