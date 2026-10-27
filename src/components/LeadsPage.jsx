import { useEffect, useRef, useState } from "react";
import { getLeads, logout } from "../api.js";
import Filters, { EMPTY_FILTERS } from "./Filters.jsx";
import LeadsTable from "./LeadsTable.jsx";
import Pagination from "./Pagination.jsx";

const DEFAULT_PAGE_SIZE = 20;

export default function LeadsPage({ user, onLoggedOut }) {
  // Filters and page size of the last successful search; paging reuses them.
  const [query, setQuery] = useState({ filters: EMPTY_FILTERS, pageSize: DEFAULT_PAGE_SIZE });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const latestRequest = useRef(0);

  async function load(filters, page, pageSize) {
    const requestId = ++latestRequest.current;
    setLoading(true);
    setError("");
    try {
      const data = await getLeads({ ...filters, page, page_size: pageSize });
      if (requestId !== latestRequest.current) return;
      setQuery({ filters, pageSize });
      setResult(data);
    } catch (err) {
      if (requestId !== latestRequest.current) return;
      if (err.status === 401) return onLoggedOut();
      setError(friendlyError(err));
    } finally {
      if (requestId === latestRequest.current) setLoading(false);
    }
  }

  // Show the first page of unfiltered leads when the screen opens.
  useEffect(() => {
    load(EMPTY_FILTERS, 1, DEFAULT_PAGE_SIZE);
  }, []);

  async function handleLogout() {
    try {
      await logout();
    } catch {
      // Return to the login screen either way.
    }
    onLoggedOut();
  }

  return (
    <div className="page">
      <header className="header">
        <span className="brand">groundwork<span className="tm">™</span></span>
        <div className="header-right">
          <span className="muted email">{user.email}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main className="content">
        <Filters onSearch={(f) => load(f, 1, query.pageSize)} disabled={loading} />

        {error && <p className="error banner" role="alert">{error}</p>}

        <section className="card results" aria-busy={loading}>
          {loading && <div className="loading-bar" />}
          {result ? (
            <LeadsTable leads={result.data} dimmed={loading} />
          ) : (
            loading && <p className="empty">Loading leads…</p>
          )}
        </section>

        {result && (
          <Pagination
            page={result.page}
            pageSize={result.page_size}
            count={result.data.length}
            hasMore={result.has_more}
            disabled={loading}
            onPageChange={(p) => load(query.filters, p, query.pageSize)}
            onPageSizeChange={(size) => load(query.filters, 1, size)}
          />
        )}
      </main>
    </div>
  );
}

function friendlyError(err) {
  if (err.status === 429) return "Too many requests. Please wait a minute and try again.";
  if (err.status === 400) return `Check your filters: ${err.message}`;
  return err.message;
}
