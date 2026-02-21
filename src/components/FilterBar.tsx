type Props = {
    query: string;
    onQueryChange: (v: string) => void;
    count: number;
  };
  
  export function FilterBar({ query, onQueryChange, count }: Props) {
    return (
      <div className="panel controls">
        <div className="control grow">
          <label className="label">Search</label>
          <input
            className="input"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Filter by title or description…"
          />
        </div>
  
        <div className="chip">{count} tasks</div>
      </div>
    );
  }