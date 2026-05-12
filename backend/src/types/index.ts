export interface Channel {
  id: number;
  slack_id: string;
  name: string;
  created_at: string;
}

export interface Message {
  id: number;
  channel_id: number;
  channel_name?: string;
  slack_ts: string;
  user_id: string | null;
  username: string | null;
  text: string | null;
  posted_at: string;
  synced_at: string;
}

export interface MessagesQuery {
  channel_id?: string;
  keyword?: string;
  date_from?: string;
  date_to?: string;
  limit?: string;
  offset?: string;
}
