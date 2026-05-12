interface Props {
  keyword: string;
  dateFrom: string;
  dateTo: string;
  onChange: (field: "keyword" | "dateFrom" | "dateTo", value: string) => void;
  onSearch: () => void;
}

export default function SearchBar({ keyword, dateFrom, dateTo, onChange, onSearch }: Props) {
  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-input"
        placeholder="キーワード検索..."
        value={keyword}
        onChange={(e) => onChange("keyword", e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
      />
      <input
        type="date"
        className="date-input"
        value={dateFrom}
        onChange={(e) => onChange("dateFrom", e.target.value)}
      />
      <span className="date-sep">〜</span>
      <input
        type="date"
        className="date-input"
        value={dateTo}
        onChange={(e) => onChange("dateTo", e.target.value)}
      />
      <button className="btn btn-search" onClick={onSearch}>検索</button>
    </div>
  );
}
