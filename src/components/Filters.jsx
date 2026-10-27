import { useState } from "react";
import { PHASES, SECTORS } from "../format.js";

export const EMPTY_FILTERS = {
  city: "",
  phase: "",
  sector: "",
  min_value: "",
  max_value: "",
};

// Holds the draft values locally; nothing is fetched until Search is submitted.
export default function Filters({ onSearch, disabled }) {
  const [draft, setDraft] = useState(EMPTY_FILTERS);

  const set = (key) => (e) => setDraft({ ...draft, [key]: e.target.value });

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(draft);
  }

  return (
    <form className="card filters" onSubmit={handleSubmit}>
      <label>
        City
        <input value={draft.city} onChange={set("city")} placeholder="e.g. Toronto" />
      </label>

      <label>
        Phase
        <select value={draft.phase} onChange={set("phase")}>
          <option value="">Any</option>
          {PHASES.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </label>

      <label>
        Sector
        <select value={draft.sector} onChange={set("sector")}>
          <option value="">Any</option>
          {SECTORS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </label>

      <label>
        Min value
        <input
          type="number"
          min="0"
          step="any"
          inputMode="numeric"
          value={draft.min_value}
          onChange={set("min_value")}
          placeholder="0"
        />
      </label>

      <label>
        Max value
        <input
          type="number"
          min="0"
          step="any"
          inputMode="numeric"
          value={draft.max_value}
          onChange={set("max_value")}
          placeholder="Any"
        />
      </label>

      <button type="submit" className="primary" disabled={disabled}>
        Search
      </button>
    </form>
  );
}
