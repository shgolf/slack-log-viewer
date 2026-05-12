import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { getMessages } from "../api/client";
import type { Message } from "../types";
import SearchBar from "../components/SearchBar";
import MessageList from "../components/MessageList";

const PAGE_SIZE = 50;

export default function MessagesPage() {
  const { channelId } = useParams<{ channelId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const fetchData = useCallback(
    async (currentPage: number) => {
      if (!channelId) return;
      setLoading(true);
      try {
        const res = await getMessages({
          channel_id: Number(channelId),
          keyword: keyword || undefined,
          date_from: dateFrom || undefined,
          date_to: dateTo || undefined,
          limit: PAGE_SIZE,
          offset: currentPage * PAGE_SIZE,
        });
        setMessages(res.messages);
        setTotal(res.total);
      } finally {
        setLoading(false);
      }
    },
    [channelId, keyword, dateFrom, dateTo]
  );

  useEffect(() => {
    fetchData(0);
    setPage(0);
  }, [channelId]);

  function handleSearch() {
    setPage(0);
    fetchData(0);
  }

  function handlePageChange(newPage: number) {
    setPage(newPage);
    fetchData(newPage);
  }

  function handleFilterChange(field: "keyword" | "dateFrom" | "dateTo", value: string) {
    if (field === "keyword") setKeyword(value);
    if (field === "dateFrom") setDateFrom(value);
    if (field === "dateTo") setDateTo(value);
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Link to="/" style={{ color: "#1264a3", textDecoration: "none" }}>← チャンネル一覧</Link>
      </div>
      <SearchBar
        keyword={keyword}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onChange={handleFilterChange}
        onSearch={handleSearch}
      />
      <MessageList
        messages={messages}
        total={total}
        loading={loading}
        page={page}
        pageSize={PAGE_SIZE}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
