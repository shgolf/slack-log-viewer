import type { Message } from "../types";

interface Props {
  messages: Message[];
  total: number;
  loading: boolean;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MessageList({ messages, total, loading, page, pageSize, onPageChange }: Props) {
  const totalPages = Math.ceil(total / pageSize);

  if (loading) return <p>読み込み中...</p>;
  if (messages.length === 0) return <p>メッセージがありません。</p>;

  return (
    <div>
      <p style={{ color: "#666", fontSize: 14 }}>{total} 件</p>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {messages.map((msg) => (
          <li key={msg.id} style={{ padding: "12px 0", borderBottom: "1px solid #eee" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "baseline" }}>
              <span style={{ fontWeight: "bold", color: "#1264a3", minWidth: 100 }}>
                {msg.username ?? msg.user_id ?? "Unknown"}
              </span>
              <span style={{ fontSize: 12, color: "#999" }}>{formatDate(msg.posted_at)}</span>
            </div>
            <p style={{ margin: "4px 0 0", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {msg.text ?? "(添付ファイル)"}
            </p>
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "center" }}>
          <button onClick={() => onPageChange(page - 1)} disabled={page === 0}>前へ</button>
          <span style={{ alignSelf: "center" }}>{page + 1} / {totalPages}</span>
          <button onClick={() => onPageChange(page + 1)} disabled={page + 1 >= totalPages}>次へ</button>
        </div>
      )}
    </div>
  );
}
