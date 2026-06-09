import React, { Suspense, lazy, useMemo } from "react";
import { useRegionStore } from "@/shared/store/region";

const MapEngine = lazy(() => import("../modules/map"));

type InfoIcon = "landmark" | "house" | "database" | "cpu" | "shield";

const STATIC_RANKING = [
  { id: "kerala", name: "Kerala", score: 78.6 },
  { id: "tamil-nadu", name: "Tamil Nadu", score: 74.1 },
  { id: "maharashtra", name: "Maharashtra", score: 72.8 },
  { id: "gujarat", name: "Gujarat", score: 68.7 },
  { id: "karnataka", name: "Karnataka", score: 67.1 },
  { id: "andhra-pradesh", name: "Andhra Pradesh", score: 64.3 },
  { id: "telangana", name: "Telangana", score: 63.8 },
  { id: "himachal-pradesh", name: "Himachal Pradesh", score: 62.9 },
];

const INFO_STRIP_ITEMS: { icon: InfoIcon; color: string; title: string; subtitle: string; variant: string }[] = [
  { icon: "landmark", color: "#8bd5ff", title: "100% District Coverage", subtitle: "All 767 Districts", variant: "coverage" },
  { icon: "house", color: "#f4c26b", title: "6.4 Lakh+ Villages", subtitle: "Complete Rural Coverage", variant: "villages" },
  { icon: "database", color: "#7ad1a5", title: "200+ Data Parameters", subtitle: "Multi-Source Integration", variant: "data" },
  { icon: "cpu", color: "#c5a5ff", title: "AI-Powered Insights", subtitle: "Smart Decision Support", variant: "ai" },
  { icon: "shield", color: "#6fd0ff", title: "Secure & Reliable", subtitle: "Government Grade Security", variant: "security" },
];

const OVERVIEW_CARDS = [
  { label: "States & UTs", value: "28 + 8", icon: "\uD83C\uDFDB\uFE0F", color: "#6ad1ff" },
  { label: "Total Population", value: "1.42B+", icon: "\uD83D\uDC65", color: "#60a5fa" },
  { label: "Total Area", value: "3.28M km\u00B2", icon: "\uD83D\uDDFA\uFE0F", color: "#34d399" },
  { label: "GDP (Nominal) (2024-25)", value: "\u20B9273.4L Cr", icon: "\uD83D\uDCB0", color: "#fbbf24" },
  { label: "Road Network", value: "6.31M km", icon: "\uD83D\uDEE3\uFE0F", color: "#f59e0b" },
  { label: "Health Index (Out of 100)", value: "62.4", icon: "\u2764\uFE0F", color: "#f43f5e" },
  { label: "Education Index (Out of 100)", value: "68.7", icon: "\uD83C\uDF93", color: "#a78bfa" },
  { label: "Power Coverage (Households)", value: "99.1%", icon: "\u26A1", color: "#fbbf24" },
  { label: "Internet Coverage (Households)", value: "74.3%", icon: "\uD83D\uDCF6", color: "#38bdf8" },
  { label: "Languages", value: "35", icon: "\uD83D\uDDE3\uFE0F", color: "#4ade80" },
];

const INTEL_CARDS = [
  { key: "population", label: "Population Index", value: 72.4, grade: "B+", delta: 1.36, icon: "\uD83D\uDC65", color: "#3b82f6" },
  { key: "infrastructure", label: "Infrastructure Index", value: 64.8, grade: "B", delta: 2.18, icon: "\uD83C\uDFD7\uFE0F", color: "#f59e0b" },
  { key: "health", label: "Health Index", value: 62.4, grade: "B-", delta: 1.45, icon: "\u2764\uFE0F", color: "#ef4444" },
  { key: "education", label: "Education Index", value: 68.7, grade: "B", delta: 2.18, icon: "\uD83C\uDF93", color: "#8b5cf6" },
  { key: "agriculture", label: "Agriculture Index", value: 60.1, grade: "B-", delta: 1.95, icon: "\uD83C\uDF3E", color: "#22c55e" },
  { key: "connectivity", label: "Connectivity Index", value: 72.8, grade: "B+", delta: 2.72, icon: "\uD83D\uDCF6", color: "#0ea5e9" },
];

/* Simple SVG sparkline — generates a small upward-trending line */
function Sparkline({ color, seed }: { color: string; seed: number }) {
  const points = useMemo(() => {
    const pts: number[] = [];
    let v = 30 + (seed * 17) % 20;
    for (let i = 0; i < 12; i++) {
      v += (Math.sin(seed + i * 1.7) * 8) + 2;
      v = Math.max(10, Math.min(55, v));
      pts.push(v);
    }
    return pts.map((y, i) => `${i * 10},${60 - y}`).join(' ');
  }, [seed]);

  return (
    <svg viewBox="0 0 110 60" className="sparkline-svg" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,60 ${points} 110,60`}
        fill={`url(#sg-${color.replace('#','')})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function renderFeatureIcon(icon: InfoIcon) {
  const commonProps: React.SVGProps<SVGSVGElement> = {
    className: "feature-icon__svg",
    stroke: "currentColor",
    fill: "none",
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  switch (icon) {
    case "landmark":
      return (
        <svg viewBox="0 0 24 24" {...commonProps}>
          <path d="M4 10h16" />
          <path d="M6 10v6" />
          <path d="M10 10v6" />
          <path d="M14 10v6" />
          <path d="M18 10v6" />
          <path d="M3 18h18" />
          <path d="M12 4 4 8h16z" />
        </svg>
      );
    case "house":
      return (
        <svg viewBox="0 0 24 24" {...commonProps}>
          <path d="m3 11 9-7 9 7" />
          <path d="M5 10v9h14v-9" />
          <path d="M10 19v-5h4v5" />
        </svg>
      );
    case "database":
      return (
        <svg viewBox="0 0 24 24" {...commonProps}>
          <ellipse cx="12" cy="5" rx="7" ry="3" />
          <path d="M5 5v14c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
          <path d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3" />
        </svg>
      );
    case "cpu":
      return (
        <svg viewBox="0 0 24 24" {...commonProps}>
          <rect x="7" y="7" width="10" height="10" rx="2" />
          <path d="M10 2v3" />
          <path d="M14 2v3" />
          <path d="M10 19v3" />
          <path d="M14 19v3" />
          <path d="M2 10h3" />
          <path d="M2 14h3" />
          <path d="M19 10h3" />
          <path d="M19 14h3" />
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 24 24" {...commonProps}>
          <path d="M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6z" />
          <path d="m9.5 12.5 2 2 3-3" />
        </svg>
      );
    default:
      return null;
  }
}

export default function StateIntelligenceDashboard() {
  const activeRegionId = useRegionStore((s) => s.activeRegionId);
  const selectRegion = useRegionStore((s) => s.selectRegion);

  return (
    <div className="state-dashboard">
      <header className="state-dashboard__header">
        <div className="state-brand">
          <div className="state-brand__logo" aria-hidden />
          <div>
            <p className="state-brand__kicker">Better Bharat Map</p>
            <h1 className="state-brand__title">State Intelligence Platform</h1>
          </div>
        </div>
        <div className="state-header__actions">
          <input className="state-search" placeholder="Search State..." aria-label="Search state" />
          <div className="state-header__buttons">
            <button type="button" className="state-btn">Data Year 2024</button>
            <button type="button" className="state-btn">Fit to India</button>
            <button type="button" className="state-btn">Export</button>
          </div>
        </div>
      </header>

      <div className="state-dashboard__main">
        <section className="panel-surface state-main__left" aria-label="State Intelligence">
          <header className="state-panel__header state-panel__header--compact">
            <p className="panel-kicker panel-kicker--sm">STATE INTELLIGENCE</p>
            <h2 className="state-panel__title state-panel__title--compact">Discover, analyze and compare</h2>
            <p className="state-panel__subtitle state-panel__subtitle--sm">All 28 States &amp; 8 UTs of India</p>
          </header>

          <div className="state-panel__controls state-panel__controls--tight">
            <div className="state-panel__search-wrap state-panel__search-wrap--compact">
              <input className="state-panel__search state-panel__search--compact" placeholder="Search state..." aria-label="Search state" />
              <span className="state-panel__search-icon" aria-hidden>🔍</span>
            </div>
            <div className="state-panel__filters state-panel__filters--stacked">
              <label className="state-panel__filter-row">
                <span>Filter by Population</span>
                <select defaultValue="all">
                  <option value="all">All</option>
                  <option value=">50m">&gt; 50M</option>
                  <option value="<50m">&lt; 50M</option>
                </select>
              </label>
              <label className="state-panel__filter-row">
                <span>Filter by Region</span>
                <select defaultValue="all">
                  <option value="all">All</option>
                  <option value="north">North</option>
                  <option value="south">South</option>
                  <option value="east">East</option>
                  <option value="west">West</option>
                </select>
              </label>
              <label className="state-panel__filter-row">
                <span>Sort by</span>
                <select defaultValue="overall">
                  <option value="overall">Overall Index</option>
                  <option value="population">Population</option>
                </select>
              </label>
            </div>
          </div>

          <p className="state-panel__section-title state-panel__section-title--inline">STATES RANKING BY OVERALL INDEX</p>
          <div className="state-panel__table state-panel__table--slim">
            <div className="state-panel__table-head state-panel__table-head--slim">
              <span>#</span>
              <span>State</span>
              <span className="state-panel__score">Overall Index</span>
            </div>
            <div className="state-panel__table-body state-panel__table-body--slim">
              {STATIC_RANKING.map((row, idx) => (
                <button
                  key={row.id}
                  type="button"
                  className={`state-panel__row state-panel__row--slim${activeRegionId === row.id ? " is-active" : ""}`}
                  onClick={() => selectRegion(row.id)}
                >
                  <span className="state-panel__rank">{idx + 1}</span>
                  <span className="state-panel__name">{row.name}</span>
                  <span className="state-panel__score state-panel__score--slim">{row.score.toFixed(1)}</span>
                </button>
              ))}
            </div>
            <div className="state-panel__table-footer">
              <button type="button" className="state-panel__cta state-panel__cta--slim">View All States &amp; UTs <span aria-hidden>→</span></button>
            </div>
          </div>
        </section>

        <section className="panel-surface state-main__map" aria-label="India State Map">
          <div className="state-map__card">
            <header className="state-map__header">
              <div>
                <p className="panel-kicker">INDIA – STATE MAP</p>
                <h2 className="state-map__title">All 28 States &amp; 8 UTs</h2>
                <p className="state-map__subtitle">Development &amp; Infrastructure Overview</p>
              </div>
              <div className="state-map__controls">
                <button type="button" className="state-btn" aria-label="Zoom in">+</button>
                <button type="button" className="state-btn" aria-label="Zoom out">−</button>
              </div>
            </header>
            <div className="state-map__body">
              <div className="state-map__compass" aria-hidden>N</div>
              <div className="state-map__legend">
                <span>High</span>
                <div className="state-map__legend-bar" />
                <span>Low</span>
              </div>
              <div className="state-map__scale" aria-hidden>
                <span>0</span>
                <div className="state-map__scale-bar" />
                <span>1000 km</span>
              </div>
              <div className="state-map__canvas">
                <Suspense fallback={<div className="state-map__fallback" />}> 
                  <MapEngine activeLayers={{}} embedded />
                </Suspense>
              </div>
            </div>
          </div>
        </section>

        <section className="panel-surface state-main__right" aria-label="India overview">
          <p className="panel-kicker">India Overview</p>
          <p className="state-overview__sub">National level key statistics (2024)</p>
          <div className="state-overview__grid">
            {OVERVIEW_CARDS.map((card) => (
              <div key={card.label} className="state-overview__card">
                <span className="state-overview__icon" style={{ color: card.color }} aria-hidden>{card.icon}</span>
                <div className="state-overview__info">
                  <span className="state-overview__value">{card.value}</span>
                  <span className="state-overview__label">{card.label}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="state-overview__source">
            <p className="state-overview__source-text">
              <strong>Source:</strong> Ministry of Statistics &amp; Programme Implementation, India | Various Ministries &amp; Govt. Sources
            </p>
            <p className="state-overview__updated">Last Updated <strong>20 May 2024</strong></p>
          </div>
        </section>
      </div>

      <section className="panel-surface state-bottom" aria-label="Key Development Indices">
        <p className="panel-kicker">Key Development Indices</p>
        <div className="state-bottom__grid">
          {INTEL_CARDS.map((card) => (
            <div key={card.key} className="state-bottom__card" style={{ '--card-color': card.color } as React.CSSProperties}>
              <div className="state-bottom__top">
                <div className="state-bottom__top-left">
                  <span className="state-bottom__icon" aria-hidden>{card.icon}</span>
                  <span className="state-bottom__label">{card.label}</span>
                </div>
                <span className="state-bottom__badge">{card.grade}</span>
              </div>
              <div className="state-bottom__value-row">
                <div className="state-bottom__score-block">
                  <span className="state-bottom__value">{card.value}</span>
                  <span className="state-bottom__unit">(Out of 100)</span>
                </div>
                <span className="state-bottom__delta">▲ {card.delta}% <span className="state-bottom__vs">vs 2023</span></span>
              </div>
              <div className="state-bottom__spark-row">
                <Sparkline color={card.color} seed={card.value} />
              </div>
            </div>
          ))}
        </div>
        <div className="state-bottom__features">
          <div className="feature-strip-grid">
            {INFO_STRIP_ITEMS.map((item, index) => (
              <React.Fragment key={item.title}>
                <div className={`state-feature feature-item feature-${item.variant}`}>
                  <span className="state-feature__icon feature-icon icon-card" style={{ color: item.color }} aria-hidden>
                    {renderFeatureIcon(item.icon)}
                  </span>
                  <div className="feature-text">
                    <div className="feature-title">{item.title}</div>
                    <div className="feature-subtitle">{item.subtitle}</div>
                  </div>
                </div>
                {index < INFO_STRIP_ITEMS.length - 1 && <span className="feature-divider" aria-hidden />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
