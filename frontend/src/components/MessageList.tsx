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
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function avatarColor(name: string) {
  const colors = ["#1264a3", "#2EB886", "#E01E5A", "#ECB22E", "#E8912D", "#6E40C9"];
  let hash = 0;
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) & 0xffff;
  return colors[hash % colors.length];
}

export default function MessageList({ messages, total, loading, page, pageSize, onPageChange }: Props) {
  const totalPages = Math.ceil(total / pageSize);

  if (loading) return <div className="state-message">読み込み中...</div>;
  if (messages.length === 0) return <div className="state-message">メッセージがありません</div>;

  return (
    <>
      <div className="messages-container">
        <div className="total-count">{total.toLocaleString()} 件</div>
        {messages.map((msg) => {
          const name = msg.username ?? msg.user_id ?? "?";
          return (
            <div key={msg.id} className="message">
              <div className="avatar" style={{ background: avatarColor(name) }}>
                {name.charAt(0)}
              </div>
              <div className="message-content">
                <div className="message-meta">
                  <span className="message-username">{name}</span>
                  <span className="message-time">{formatDate(msg.posted_at)}</span>
                </div>
                <div className="message-text">
                  {msg.text ?? <span className="message-empty">(添付ファイル)</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button className="btn btn-page" onClick={() => onPageChange(page - 1)} disabled={page === 0}>← 前へ</button>
          <span className="pagination-info">{page + 1} / {totalPages}</span>
          <button className="btn btn-page" onClick={() => onPageChange(page + 1)} disabled={page + 1 >= totalPages}>次へ →</button>
        </div>
      )}
    </>
  );
}
