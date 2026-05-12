import { useState } from "react";
import { triggerSync } from "../api/client";
import ChannelList from "../components/ChannelList";

export default function ChannelsPage() {
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  async function handleSync() {
    setSyncing(true);
    setSyncResult(null);
    try {
      const result = await triggerSync();
      setSyncResult(`同期完了：${result.inserted} 件を追加しました`);
      setRefreshKey((k) => k + 1);
    } catch (e) {
      setSyncResult("同期に失敗しました");
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>チャンネル一覧</h2>
        <button
          onClick={handleSync}
          disabled={syncing}
          style={{ padding: "6px 16px", background: "#2eb886", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}
        >
          {syncing ? "同期中..." : "Slackから同期"}
        </button>
      </div>
      {syncResult && <p style={{ color: "#2eb886" }}>{syncResult}</p>}
      <ChannelList key={refreshKey} />
    </div>
  );
}
