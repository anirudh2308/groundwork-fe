import { formatDate, formatValue, phaseLabel, sectorLabel } from "../format.js";

export default function LeadsTable({ leads, dimmed }) {
  if (leads.length === 0) {
    return <p className="empty">No leads found</p>;
  }

  return (
    <div className={`table-wrap${dimmed ? " dimmed" : ""}`}>
      <table>
        <thead>
          <tr>
            <th>Address</th>
            <th>City</th>
            <th>Phase</th>
            <th>Sector</th>
            <th className="num">Value</th>
            <th className="num">Units</th>
            <th>Filed</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
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
  );
}
