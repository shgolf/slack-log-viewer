import { WebClient } from "@slack/web-api";
import dotenv from "dotenv";

dotenv.config();

export const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

export async function fetchAllChannels() {
  const result = await slack.conversations.list({
    types: "public_channel,private_channel",
    limit: 200,
  });
  return result.channels ?? [];
}

export async function fetchMessages(channelId: string, oldestTs: string) {
  const messages: Array<{
    ts: string;
    user?: string;
    username?: string;
    text?: string;
  }> = [];

  let cursor: string | undefined;

  do {
    const result = await slack.conversations.history({
      channel: channelId,
      oldest: oldestTs,
      limit: 200,
      cursor,
    });

    for (const msg of result.messages ?? []) {
      if (msg.type === "message" && !msg.subtype && msg.ts) {
        messages.push({
          ts: msg.ts,
          user: msg.user,
          username: msg.username,
          text: msg.text,
        });
      }
    }

    cursor = result.response_metadata?.next_cursor ?? undefined;
  } while (cursor);

  return messages;
}
