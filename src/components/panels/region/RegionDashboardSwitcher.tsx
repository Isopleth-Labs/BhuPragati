import { memo, useMemo } from "react";
import { useRegionStore } from "@/shared/store/region";
import { getChildren, getRegion } from "@/data/regions";

type RankingRow = { id: string; name: string; score: number };

const STATE_RANKING: RankingRow[] = [
  { id: "kerala", name: "Kerala", score: 78.6 },
  { id: "tamil-nadu", name: "Tamil Nadu", score: 74.1 },
  { id: "maharashtra", name: "Maharashtra", score: 72.4 },
  { id: "gujarat", name: "Gujarat", score: 68.7 },
  { id: "karnataka", name: "Karnataka", score: 68.4 },
  { id: "andhra-pradesh", name: "Andhra Pradesh", score: 64.3 },
  { id: "telangana", name: "Telangana", score: 63.6 },
  { id: "himachal-pradesh", name: "Himachal Pradesh", score: 62.9 },
];

const OVERVIEW_CARDS = [
  { label: "States & UTs", value: "28 + 8" },
  { label: "Total Population", value: "1.42B+" },
  { label: "Total Area", value: "3.28M km²" },
  { label: "GDP (Nominal)", value: "₹273.4L Cr" },
  { label: "Road Network", value: "6.31M km" },
  { label: "Health Index", value: "62.4" },
  { label: "Education Index", value: "68.7" },
  { label: "Power Coverage", value: "99.1%" },
  { label: "Internet Coverage", value: "74.3%" },
  { label: "Languages", value: "35" },
];

const INTEL_CARDS = [
  { key: "population", label: "Population Intelligence", value: "72.4", grade: "B+", delta: "+1.36%" },
  { key: "infra", label: "Infrastructure", value: "64.8", grade: "B", delta: "+2.18%" },
  { key: "health", label: "Health", value: "62.4", grade: "B-", delta: "+1.42%" },
  { key: "education", label: "Education", value: "68.7", grade: "B", delta: "+2.18%" },
  { key: "agri", label: "Agriculture", value: "60.1", grade: "B-", delta: "+1.95%" },
  { key: "connectivity", label: "Connectivity", value: "72.8", grade: "B+", delta: "-2.72%" },
];

function StateIntelPanel({
  rows,
  activeRegionId,
  onSelect,
}: {
  rows: RankingRow[];
  activeRegionId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <section className="panel-surface state-panel state-panel--left" aria-label="State Intelligence">
      <header className="state-panel__header">
        <div>
          <p className="panel-kicker">State Intelligence</p>
          <h2 className="state-panel__title">Discover, analyze and compare</h2>
          <p className="state-panel__subtitle">All 28 States &amp; 8 UTs of India</p>
        </div>
      </header>

      <div className="state-panel__controls">
        <input className="state-panel__search" placeholder="Search state..." aria-label="Search state" />
        <div className="state-panel__filters">
          <label className="state-panel__filter">
            <span>Filter by Population</span>
            <select defaultValue="all">
              <option value="all">All</option>
              <option value=">50m">&gt; 50M</option>
              <option value="<50m">&lt; 50M</option>
            </select>
          </label>
          <label className="state-panel__filter">
            <span>Filter by Region</span>
            <select defaultValue="all">
              <option value="all">All</option>
              <option value="north">North</option>
              <option value="south">South</option>
              <option value="east">East</option>
              <option value="west">West</option>
            </select>
          </label>
          <label className="state-panel__filter">
            <span>Sort by</span>
            <select defaultValue="overall">
              <option value="overall">Overall Index</option>
              <option value="population">Population</option>
            </select>
          </label>
        </div>
      </div>

      <div className="state-panel__table">
        <div className="state-panel__table-head">
          <span>State</span>
          <span>Overall Index</span>
        </div>
        <div className="state-panel__table-body">
          {rows.map((row) => (
            <button
              key={row.id}
              type="button"
              className={`state-panel__row${activeRegionId === row.id ? " is-active" : ""}`}
              onClick={() => onSelect(row.id)}
            >
              <span>{row.name}</span>
              <span className="state-panel__score">{row.score.toFixed(1)}</span>
            </button>
          ))}
        </div>
      </div>

      <button type="button" className="state-panel__cta">View All States &amp; UTs</button>
    </section>
  );
}

function OverviewPanel({ metrics, title }: { metrics: { label: string; value: string }[]; title: string }) {
  return (
    <section className="panel-surface state-panel state-panel--right" aria-label="India overview">
      <p className="panel-kicker">{title}</p>
      <div className="state-overview__grid">
        {metrics.map((m) => (
          <div key={m.label} className="state-overview__card">
            <span className="state-overview__label">{m.label}</span>
            <span className="state-overview__value">{m.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function IntelStrip({ metrics }: { metrics: typeof INTEL_CARDS }) {
  return (
    <section className="panel-surface state-panel state-panel--bottom" aria-label="Key development indices">
      <div className="state-intel__grid">
        {metrics.map((m) => (
          <div key={m.key} className="state-intel__card">
            <div className="state-intel__top">
              <span className="state-intel__label">{m.label}</span>
              <span className="state-intel__badge">{m.grade}</span>
            </div>
            <div className="state-intel__value-row">
              <span className="state-intel__value">{m.value}</span>
              <span className="state-intel__delta">{m.delta}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function RegionDashboardSwitcher() {
  const activeRegionId = useRegionStore((s) => s.activeRegionId);
  const registryReady = useRegionStore((s) => s.registryReady);
  const selectRegion = useRegionStore((s) => s.selectRegion);
  const region = activeRegionId ? getRegion(activeRegionId) : undefined;

  const stateItems = useMemo(() => {
    if (!registryReady) return STATE_RANKING;
    return getChildren("india")
      .filter((r) => r.level === "state")
      .map((s) => ({ id: s.id, name: s.name.en, score: STATE_RANKING.find((r) => r.id === s.id)?.score ?? 60 }))
      .sort((a, b) => b.score - a.score);
  }, [registryReady]);

  return (
    <div className="state-shell">
      <StateIntelPanel rows={stateItems} activeRegionId={activeRegionId} onSelect={(id) => selectRegion(id)} />

      <OverviewPanel title={region ? `${region.name.en} Overview` : "India Overview"} metrics={OVERVIEW_CARDS} />

      <IntelStrip metrics={INTEL_CARDS} />
    </div>
  );
}

export default memo(RegionDashboardSwitcher);
