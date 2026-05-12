interface Props {
  keyword: string;
  dateFrom: string;
  dateTo: string;
  onChange: (field: "keyword" | "dateFrom" | "dateTo", value: string) => void;
  onSearch: () => void;
}

export default function SearchBar({ keyword, dateFrom, dateTo, onChange, onSearch }: Props) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
      <input
        type="text"
        placeholder="キーワード検索..."
        value={keyword}
        onChange={(e) => onChange("keyword", e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
        style={{ flex: 1, minWidth: 160, padding: "6px 10px", border: "1px solid #ccc", borderRadius: 4 }}
      />
      <input
        type="date"
        value={dateFrom}
        onChange={(e) => onChange("dateFrom", e.target.value)}
        style={{ padding: "6px 10px", border: "1px solid #ccc", borderRadius: 4 }}
      />
      <span style={{ alignSelf: "center" }}>〜</span>
      <input
        type="date"
        value={dateTo}
        onChange={(e) => onChange("dateTo", e.target.value)}
        style={{ padding: "6px 10px", border: "1px solid #ccc", borderRadius: 4 }}
      />
      <button
        onClick={onSearch}
        style={{ padding: "6px 16px", background: "#1264a3", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}
      >
        検索
      </button>
    </div>
  );
}
