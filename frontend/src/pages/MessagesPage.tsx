import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getMessages } from "../api/client";
import type { Message } from "../types";
import SearchBar from "../components/SearchBar";
import MessageList from "../components/MessageList";

const PAGE_SIZE = 50;

export default function MessagesPage({ refreshKey }: { refreshKey?: number }) {
  const { channelId } = useParams<{ channelId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [channelName, setChannelName] = useState("");

  const fetchData = useCallback(async (currentPage: number) => {
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
      if (res.messages[0]?.channel_name) setChannelName(res.messages[0].channel_name);
    } finally {
      setLoading(false);
    }
  }, [channelId, keyword, dateFrom, dateTo]);

  useEffect(() => {
    setPage(0);
    setKeyword("");
    setDateFrom("");
    setDateTo("");
    setChannelName("");
  }, [channelId]);

  useEffect(() => {
    fetchData(0);
  }, [channelId]);

  useEffect(() => {
    if (refreshKey) fetchData(page);
  }, [refreshKey]);

  function handleSearch() {
    setPage(0);
    fetchData(0);
  }

  function handlePageChange(newPage: number) {
    setPage(newPage);
    fetchData(newPage);
    window.scrollTo(0, 0);
  }

  function handleFilterChange(field: "keyword" | "dateFrom" | "dateTo", value: string) {
    if (field === "keyword") setKeyword(value);
    if (field === "dateFrom") setDateFrom(value);
    if (field === "dateTo") setDateTo(value);
  }

  return (
    <>
      <div className="main-header">
        <h2># {channelName || "..."}</h2>
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
    </>
  );
}
