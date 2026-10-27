import { useState } from "react";

export const PAGE_SIZES = [10, 20, 50, 100];

// The API has no total count, so we only know pages up to the current one,
// plus the next one when has_more is true.
function visiblePages(page, hasMore) {
  const start = Math.max(1, page - 2);
  const end = hasMore ? page + 1 : page;
  const pages = [];
  for (let p = start; p <= end; p++) pages.push(p);
  return pages;
}

export default function Pagination({
  page,
  pageSize,
  count,
  hasMore,
  disabled,
  onPageChange,
  onPageSizeChange,
}) {
  const [jumpTo, setJumpTo] = useState("");
  const pages = visiblePages(page, hasMore);
  const first = (page - 1) * pageSize + 1;
  const last = (page - 1) * pageSize + count;

  function handleJump(e) {
    e.preventDefault();
    const p = Number(jumpTo);
    if (Number.isInteger(p) && p >= 1 && p !== page) onPageChange(p);
    setJumpTo("");
  }

  const pageButton = (p) => (
    <button
      key={p}
      className={`page-btn${p === page ? " current" : ""}`}
      aria-current={p === page ? "page" : undefined}
      onClick={() => onPageChange(p)}
      disabled={disabled || p === page}
    >
      {p.toLocaleString()}
    </button>
  );

  return (
    <nav className="pagination" aria-label="Pagination">
      <span className="muted range">
        {count === 0
          ? "No results on this page"
          : `Showing ${first.toLocaleString()}–${last.toLocaleString()}` +
            (hasMore ? "" : ` of ${last.toLocaleString()}`)}
      </span>

      <div className="pages">
        <button onClick={() => onPageChange(1)} disabled={disabled || page <= 1} aria-label="First page">
          «
        </button>
        <button onClick={() => onPageChange(page - 1)} disabled={disabled || page <= 1}>
          ‹ Prev
        </button>

        {pages[0] > 1 && pageButton(1)}
        {pages[0] > 2 && <span className="ellipsis">…</span>}
        {pages.map(pageButton)}
        {hasMore && <span className="ellipsis">…</span>}

        <button onClick={() => onPageChange(page + 1)} disabled={disabled || !hasMore}>
          Next ›
        </button>
      </div>

      <div className="page-tools">
        <label className="inline">
          Rows
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            disabled={disabled}
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </label>

        <form className="inline" onSubmit={handleJump}>
          <label className="inline">
            Go to
            <input
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              className="jump"
              value={jumpTo}
              onChange={(e) => setJumpTo(e.target.value)}
              placeholder={String(page)}
            />
          </label>
          <button type="submit" disabled={disabled || jumpTo === ""}>Go</button>
        </form>
      </div>
    </nav>
  );
}
