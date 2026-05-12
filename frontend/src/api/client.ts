import type { Channel, MessagesResponse } from "../types";

const BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? "/api";

export async function getChannels(): Promise<Channel[]> {
  const res = await fetch(`${BASE}/channels`);
  if (!res.ok) throw new Error("Failed to fetch channels");
  return res.json();
}

export async function getMessages(params: {
  channel_id?: number;
  keyword?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}): Promise<MessagesResponse> {
  const query = new URLSearchParams();
  if (params.channel_id != null) query.set("channel_id", String(params.channel_id));
  if (params.keyword) query.set("keyword", params.keyword);
  if (params.date_from) query.set("date_from", params.date_from);
  if (params.date_to) query.set("date_to", params.date_to);
  if (params.limit != null) query.set("limit", String(params.limit));
  if (params.offset != null) query.set("offset", String(params.offset));

  const res = await fetch(`${BASE}/messages?${query}`);
  if (!res.ok) throw new Error("Failed to fetch messages");
  return res.json();
}

export async function triggerSync(): Promise<{ ok: boolean; inserted: number }> {
  const res = await fetch(`${BASE}/sync`, { method: "POST" });
  if (!res.ok) throw new Error("Sync failed");
  return res.json();
}
