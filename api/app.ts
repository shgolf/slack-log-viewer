import express from "express";
import cors from "cors";
import channelsRouter from "./routes/channels";
import messagesRouter from "./routes/messages";
import syncRouter from "./routes/sync";

export const app = express();

app.use(cors());
app.use(express.json());
app.use((req, _res, next) => { console.log(`[REQ] ${req.method} ${req.url}`); next(); });

app.use("/api/channels", channelsRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/sync", syncRouter);

app.get("/health", (_req, res) => res.json({ ok: true }));
