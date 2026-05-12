import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { triggerSync } from "./api/client";
import Sidebar from "./components/Sidebar";
import MessagesPage from "./pages/MessagesPage";
import "./index.css";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  async function handleSync() {
    setSyncing(true);
    setSyncMsg(null);
    try {
      const r = await triggerSync();
      setSyncMsg({ text: `同期完了: ${r.inserted}件追加`, ok: true });
      setRefreshKey((k) => k + 1);
    } catch {
      setSyncMsg({ text: "同期に失敗しました", ok: false });
    } finally {
      setSyncing(false);
    }
  }

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="layout">
        <header className="header">
          <div style={{ display: "flex", alignItems: "center" }}>
            <button className="btn-menu" onClick={() => setSidebarOpen((o) => !o)}>☰</button>
            <span className="header-title">Slack Log Viewer</span>
          </div>
          <div className="header-actions">
            {syncMsg && (
              <span className={`sync-result ${syncMsg.ok ? "sync-ok" : "sync-err"}`}>
                {syncMsg.text}
              </span>
            )}
            <button className="btn btn-sync" onClick={handleSync} disabled={syncing}>
              {syncing ? "同期中..." : "同期"}
            </button>
          </div>
        </header>

        {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}

        <div className="body">
          <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>
            <div className="sidebar-section-title">チャンネル</div>
            <Sidebar key={refreshKey} onSelect={() => setSidebarOpen(false)} />
          </aside>
          <main className="main">
            <Routes>
              <Route
                path="/"
                element={
                  <div className="welcome">
                    <h3>チャンネルを選択してください</h3>
                    <p>左のサイドバーからチャンネルを選ぶとメッセージが表示されます</p>
                  </div>
                }
              />
              <Route path="/channels/:channelId" element={<MessagesPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
