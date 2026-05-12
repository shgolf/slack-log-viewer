import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getChannels } from "../api/client";
import type { Channel } from "../types";

export default function ChannelList() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getChannels()
      .then(setChannels)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (channels.length === 0) return <p>チャンネルがありません。まず同期を実行してください。</p>;

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {channels.map((ch) => (
        <li key={ch.id} style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}>
          <Link to={`/channels/${ch.id}`} style={{ textDecoration: "none", color: "#1264a3" }}>
            # {ch.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
