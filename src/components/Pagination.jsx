export default function Pagination({ page, hasMore, disabled, onChange }) {
  return (
    <nav className="pagination" aria-label="Pagination">
      <button onClick={() => onChange(page - 1)} disabled={disabled || page <= 1}>
        ← Prev
      </button>
      <span className="muted">Page {page}</span>
      <button onClick={() => onChange(page + 1)} disabled={disabled || !hasMore}>
        Next →
      </button>
    </nav>
  );
}
