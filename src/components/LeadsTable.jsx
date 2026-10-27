import { useState } from "react";
import { PHASES, formatDate, formatValue, phaseLabel, sectorLabel } from "../format.js";

const PHASE_ORDER = PHASES.map((p) => p.value);

// `sortValue` is what the column sorts by; phases sort in lifecycle order.
const COLUMNS = [
  { key: "address", label: "Address", sortValue: (l) => l.address },
  { key: "city", label: "City", sortValue: (l) => l.city },
  { key: "phase", label: "Phase", sortValue: (l) => PHASE_ORDER.indexOf(l.phase) },
  { key: "sector", label: "Sector", sortValue: (l) => sectorLabel(l.sector) },
  { key: "est_value", label: "Value", numeric: true, sortValue: (l) => Number(l.est_value) },
  { key: "units", label: "Units", numeric: true, sortValue: (l) => l.units },
  { key: "filed_at", label: "Filed", sortValue: (l) => Date.parse(l.filed_at) },
];

// Nulls always go last, whichever direction is chosen.
function compare(a, b, dir) {
  if (a === null || a === undefined) return b === null || b === undefined ? 0 : 1;
  if (b === null || b === undefined) return -1;
  const result =
    typeof a === "string" ? a.localeCompare(b, undefined, { numeric: true }) : a - b;
  return dir === "asc" ? result : -result;
}

function sortLeads(leads, sort) {
  if (!sort) return leads;
  const column = COLUMNS.find((c) => c.key === sort.key);
  return [...leads].sort((x, y) => compare(column.sortValue(x), column.sortValue(y), sort.dir));
}

export default function LeadsTable({ leads, dimmed }) {
  // null = server order (newest filed first). Clicking a header cycles asc → desc → off.
  const [sort, setSort] = useState(null);

  function toggleSort(key) {
    if (sort?.key !== key) setSort({ key, dir: "asc" });
    else if (sort.dir === "asc") setSort({ key, dir: "desc" });
    else setSort(null);
  }

  if (leads.length === 0) {
    return <p className="empty">No leads found</p>;
  }

  const rows = sortLeads(leads, sort);
  const sortedColumn = sort && COLUMNS.find((c) => c.key === sort.key);

  return (
    <>
      <div className="table-note muted">
        {sortedColumn ? (
          <>
            Sorted by {sortedColumn.label} ({sort.dir === "asc" ? "ascending" : "descending"}) on
            this page.{" "}
            <button className="link" onClick={() => setSort(null)}>Reset</button>
          </>
        ) : (
          "Newest filed first. Click a column to sort this page."
        )}
      </div>

      <div className={`table-wrap${dimmed ? " dimmed" : ""}`}>
        <table>
          <thead>
            <tr>
              {COLUMNS.map((col) => {
                const active = sort?.key === col.key;
                return (
                  <th
                    key={col.key}
                    className={col.numeric ? "num" : undefined}
                    aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
                  >
                    <button
                      className={`sort${active ? " active" : ""}`}
                      onClick={() => toggleSort(col.key)}
                    >
                      {col.label}
                      <span className="sort-icon" aria-hidden="true">
                        {active ? (sort.dir === "asc" ? "↑" : "↓") : "↕"}
                      </span>
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((lead) => (
              <tr key={lead.id}>
                <td>{lead.address}</td>
                <td>{lead.city}</td>
                <td><span className="tag">{phaseLabel(lead.phase)}</span></td>
                <td>{sectorLabel(lead.sector)}</td>
                <td className="num">{formatValue(lead.est_value)}</td>
                <td className="num">{lead.units ?? "—"}</td>
                <td className="nowrap">{formatDate(lead.filed_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
