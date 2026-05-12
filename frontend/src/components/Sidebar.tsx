import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getChannels } from "../api/client";
import type { Channel } from "../types";

interface Props {
  onSelect: () => void;
}

export default function Sidebar({ onSelect }: Props) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getChannels()
      .then(setChannels)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: "12px 16px", color: "#9BA9A0", fontSize: 13 }}>読み込み中...</div>;
  if (channels.length === 0) return <div style={{ padding: "12px 16px", color: "#9BA9A0", fontSize: 13 }}>チャンネルなし</div>;

  return (
    <nav>
      {channels.map((ch) => (
        <NavLink
          key={ch.id}
          to={`/channels/${ch.id}`}
          className={({ isActive }) => `channel-item${isActive ? " active" : ""}`}
          onClick={onSelect}
        >
          <span>#</span>
          <span>{ch.name}</span>
        </NavLink>
      ))}
    </nav>
  );
}
