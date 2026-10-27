export const PHASES = [
  { value: "development", label: "Development" },
  { value: "pre_construction", label: "Pre-construction" },
  { value: "construction", label: "Construction" },
  { value: "occupancy", label: "Occupancy" },
];

export const SECTORS = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "institutional", label: "Institutional" },
  { value: "industrial", label: "Industrial" },
];

const labelFor = (options, value) =>
  options.find((o) => o.value === value)?.label ?? value;

export const phaseLabel = (value) => labelFor(PHASES, value);
export const sectorLabel = (value) => labelFor(SECTORS, value);

const currency = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

// est_value arrives as a string (Postgres numeric).
export function formatValue(value) {
  if (value === null || value === undefined) return "—";
  const n = Number(value);
  return Number.isNaN(n) ? "—" : currency.format(n);
}

// filed_at is a timestamptz with a real time of day, so show it in the viewer's local date.
const date = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function formatDate(iso) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : date.format(d);
}
