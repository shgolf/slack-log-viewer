export interface Channel {
  id: number;
  slack_id: string;
  name: string;
  created_at: string;
}

export interface Message {
  id: number;
  channel_id: number;
  channel_name: string;
  slack_ts: string;
  user_id: string | null;
  username: string | null;
  text: string | null;
  posted_at: string;
}

export interface MessagesResponse {
  total: number;
  messages: Message[];
}
