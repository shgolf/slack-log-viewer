import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChannelsPage from "./pages/ChannelsPage";
import MessagesPage from "./pages/MessagesPage";

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 16px", fontFamily: "sans-serif" }}>
        <h1 style={{ fontSize: 20, marginBottom: 24, color: "#1d1c1d" }}>Slack Log Viewer</h1>
        <Routes>
          <Route path="/" element={<ChannelsPage />} />
          <Route path="/channels/:channelId" element={<MessagesPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
