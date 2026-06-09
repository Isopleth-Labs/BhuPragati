import React, { Suspense, lazy, useMemo, useEffect } from "react";
import { useRegionStore } from "@/shared/store/region";
import { useThemeStore } from "@/shared/store/theme";

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

const getProgressTier = (score: number) => {
  if (score >= 75) return "tier-lime";
  if (score >= 72) return "tier-green";
  if (score >= 68) return "tier-cyan";
  if (score >= 64) return "tier-blue";
  if (score >= 62) return "tier-indigo";
  return "tier-purple";
};

const OVERVIEW_CARDS = [
  { key: "road", label: "Road Network (2024)", value: "6.31M km", color: "#f59e0b" },
  { key: "rail", label: "Rail Network (2024)", value: "67,956 km", color: "#3b82f6" },
  { key: "airports", label: "Airports (Operational)", value: "153", color: "#8b5cf6" },
  { key: "health", label: "Health Index (Out of 100)", value: "62.4", color: "#ef4444" },
  { key: "education", label: "Education Index (Out of 100)", value: "68.7", color: "#8b5cf6" },
  { key: "power", label: "Power Coverage (Households)", value: "99.1%", color: "#f59e0b" },
  { key: "internet", label: "Internet Coverage (Households)", value: "74.3%", color: "#3b82f6" },
  { key: "urban", label: "Urban Population (2024)", value: "37.7%", color: "#06b6d4" },
  { key: "forest", label: "Forest Cover (2023)", value: "21.7%", color: "#10b981" },
];

const STATS_CARDS = [
  { key: "states", label: "States & UTs", value: "28 + 8", color: "#3b82f6" },
  { key: "population", label: "Total Population", value: "1.42B+", color: "#3b82f6" },
  { key: "area", label: "Total Area", value: "3.28M km\u00B2", color: "#10b981" },
  { key: "gdp", label: "GDP (Nominal) (2024-25)", value: "\u20B9273.4L Cr", color: "#f59e0b" },
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

function renderOverviewIcon(key: string) {
  const commonProps: React.SVGProps<SVGSVGElement> = {
    width: "32",
    height: "32",
    stroke: "currentColor",
    fill: "none",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  switch (key) {
    case "road":
      return (
        <svg viewBox="0 0 24 24" {...commonProps}>
          <path d="M6 2L3 22h18L18 2z" fill="currentColor" fillOpacity="0.15" />
          <line x1="12" y1="5" x2="12" y2="7" />
          <line x1="12" y1="11" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12" y2="19" />
        </svg>
      );
    case "rail":
      return (
        <svg viewBox="0 0 24 24" {...commonProps}>
          <rect x="4" y="3" width="16" height="15" rx="2" fill="currentColor" fillOpacity="0.15" />
          <path d="M4 11h16" />
          <path d="M8 15h.01" strokeWidth="3" />
          <path d="M16 15h.01" strokeWidth="3" />
          <path d="M6 18l-2 3" />
          <path d="M18 18l2 3" />
        </svg>
      );
    case "airports":
      return (
        <svg viewBox="0 0 24 24" {...commonProps}>
          <path d="M21 16V14L13 9V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" fill="currentColor" fillOpacity="0.15" />
        </svg>
      );
    case "health":
      return (
        <svg viewBox="0 0 24 24" {...commonProps}>
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" strokeOpacity="0.4" fill="currentColor" fillOpacity="0.18" />
          <path d="M2 12h3l2-4 3 8 2-6 2 4h4" />
        </svg>
      );
    case "education":
      return (
        <svg viewBox="0 0 24 24" {...commonProps}>
          <path d="M22 10L12 5L2 10l10 5 10-5z" fill="currentColor" fillOpacity="0.15" />
          <path d="M6 12v5c0 2 2.5 3 6 3s6-1 6-3v-5" />
        </svg>
      );
    case "power":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
          <path d="M13 2L3 14h9v8l10-12h-9z" />
        </svg>
      );
    case "internet":
      return (
        <svg viewBox="0 0 24 24" {...commonProps}>
          <path d="M5 12.7a10 10 0 0 1 14 0" />
          <path d="M8.5 15.5a5 5 0 0 1 7 0" />
          <circle cx="12" cy="19" r="1" fill="currentColor" />
          <path d="M1.5 9.5a15 15 0 0 1 21 0" />
        </svg>
      );
    case "urban":
      return (
        <svg viewBox="0 0 24 24" {...commonProps}>
          <rect x="2" y="10" width="7" height="11" rx="1" fill="currentColor" fillOpacity="0.15" />
          <rect x="9" y="3" width="7" height="18" rx="1" fill="currentColor" fillOpacity="0.15" />
          <rect x="16" y="8" width="6" height="13" rx="1" fill="currentColor" fillOpacity="0.15" />
        </svg>
      );
    case "forest":
      return (
        <svg viewBox="0 0 24 24" {...commonProps}>
          <path d="M12 20v-4" />
          <path d="M17.6 15A6 6 0 0 0 12 6a6 6 0 0 0-5.6 9 4 4 0 0 0 1.6 7.6h8a4 4 0 0 0 1.6-7.6Z" fill="currentColor" fillOpacity="0.15" />
        </svg>
      );
    default:
      return null;
  }
}

function renderStatsIcon(key: string) {
  const commonProps: React.SVGProps<SVGSVGElement> = {
    width: "32",
    height: "32",
    stroke: "currentColor",
    fill: "none",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  switch (key) {
    case "states":
      return (
        <svg viewBox="4.8 2.5 16.5 16.5" fill="currentColor" width="32" height="32">
          <path d="M12.5 3c-.5 0-.9.3-1.2.7l-.4.8c-.2.4-.6.6-1 .6H9c-.4 0-.8.2-1 .5L7.2 7c-.2.3-.2.7 0 1l.5.8c.2.3.3.6.2.9l-.2.8c0 .2 0 .4.1.5l.8.8c.2.2.3.5.3.8v1.2c0 .4.2.7.5.9l1.8.8c.3.1.5.4.5.7l.1 1.2c0 .4.3.7.7.8l2 .3c.4 0 .8-.2.9-.6l.3-1c.1-.3.3-.5.6-.6h1.2c.4 0 .7-.3.8-.7l.1-.8c0-.3-.1-.6-.3-.8l-.8-.8c-.2-.2-.3-.5-.3-.8v-1c0-.4.2-.7.5-.9l1-.8c.3-.2.4-.6.4-1V7.5c0-.4-.2-.8-.5-1l-1-.7c-.3-.2-.7-.2-1 0l-.8.5c-.3.2-.7.2-1 0l-.8-.8c-.2-.2-.5-.3-.8-.3z" />
        </svg>
      );
    case "population":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
          <path d="M9 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm8.5-2c1.66 0 3-1.34 3-3s-1.34-3-3-3c-.43 0-.84.09-1.2.26 1.09 1.41 1.09 3.07 0 4.48.36.17.77.26 1.2.26zm0 2c1.33 0 4 .67 4 2v2h-5.5v-2c0-1.04-.46-1.95-1.19-2.58.9-.27 1.83-.42 2.69-.42z" />
        </svg>
      );
    case "area":
      return (
        <svg viewBox="0 0 24 24" {...commonProps}>
          <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" fill="currentColor" fillOpacity="0.15" />
          <line x1="9" y1="3" x2="9" y2="18" />
          <line x1="15" y1="6" x2="15" y2="21" />
        </svg>
      );
    case "gdp":
      return (
        <svg viewBox="0 0 24 24" {...commonProps}>
          <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.15" />
          <path d="M8 8h8" />
          <path d="M8 11h8" />
          <path d="M12 11c2.5 0 3.5-3 0-3" />
          <path d="M11 11l-3 6" />
        </svg>
      );
    default:
      return null;
  }
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

function getIconStyles(color: string) {
  let darkBg = "rgba(12, 30, 68, 0.75)";
  if (color === "#10b981" || color === "#22c55e") { // green
    darkBg = "rgba(8, 38, 26, 0.75)";
  } else if (color === "#f59e0b") { // amber/yellow
    darkBg = "rgba(45, 30, 8, 0.75)";
  } else if (color === "#ef4444") { // red
    darkBg = "rgba(45, 12, 12, 0.75)";
  } else if (color === "#8b5cf6") { // purple
    darkBg = "rgba(30, 15, 55, 0.75)";
  } else if (color === "#06b6d4" || color === "#0ea5e9" || color === "#3b82f6") { // blue/cyan
    if (color === "#3b82f6") {
      darkBg = "rgba(12, 30, 68, 0.75)";
    } else {
      darkBg = "rgba(8, 35, 45, 0.75)";
    }
  }
  return {
    color: color,
    '--icon-border': `${color}4d`, // 30% opacity
    '--icon-bg': darkBg,
    '--icon-glow': `${color}40`, // 25% opacity
  } as React.CSSProperties;
}

export default function StateIntelligenceDashboard() {
  const activeRegionId = useRegionStore((s) => s.activeRegionId);
  const selectRegion = useRegionStore((s) => s.selectRegion);
  const { resolvedMode, setMode } = useThemeStore();

  const toggleTheme = () => {
    setMode(resolvedMode === "night" ? "day" : "night");
  };

  useEffect(() => {
    const root = document.documentElement;
    if (resolvedMode === "day") {
      root.classList.add("theme-light");
      root.classList.remove("theme-dark");
      root.setAttribute("data-theme", "light");
    } else {
      root.classList.add("theme-dark");
      root.classList.remove("theme-light");
      root.setAttribute("data-theme", "dark");
    }
  }, [resolvedMode]);

  return (
    <div className="state-dashboard">
      <header className="state-dashboard__header">
        <div className="state-brand">
          <div className="state-brand__logo" aria-hidden="true">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="brand-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1f92ff" />
                  <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
                <linearGradient id="brand-logo-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00f2fe" />
                  <stop offset="100%" stopColor="#4ade80" />
                </linearGradient>
              </defs>
              {/* Top loop with angled top-left corner */}
              <path d="M4 12V8L8 4H14A4 4 0 0 1 18 8A4 4 0 0 1 14 12H4" stroke="url(#brand-logo-grad)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
              {/* Bottom loop with angled bottom-left corner */}
              <path d="M4 12H14A4 4 0 0 1 18 16A4 4 0 0 1 14 20H8L4 16V12" stroke="url(#brand-logo-grad-2)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="state-brand__text">
            <h1 className="state-brand__title">BETTER BHARAT MAP</h1>
            <p className="state-brand__subtitle">State Intelligence Platform</p>
          </div>
        </div>

        <div className="state-search-container">
          <input className="state-search" placeholder="Search State..." aria-label="Search state" />
          <span className="state-search-icon" aria-hidden="true">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
        </div>

        <div className="state-header__buttons">
          <button type="button" className="state-year-card">
            <span className="state-year-card__icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
                <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" strokeWidth="2" />
              </svg>
            </span>
            <div className="state-year-card__info">
              <span className="state-year-card__label">Data Year</span>
              <span className="state-year-card__value">2024</span>
            </div>
          </button>

          <button type="button" className="state-header-btn">
            <span aria-hidden="true" className="state-btn-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                <path d="M3 17v2a2 2 0 0 1 2 2h2" />
                <path d="M8 10l3-2 5 3 2-2v7l-2 2-5-3-3 2z" strokeWidth="1.5" />
              </svg>
            </span>
            <span>Fit to India</span>
          </button>

          <button type="button" className="state-header-btn">
            <span aria-hidden="true" className="state-btn-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </span>
            <span>Export</span>
            <span aria-hidden="true" className="state-btn-chevron">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
          </button>

          <button type="button" className="state-theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {resolvedMode === "day" ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </button>
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
              <span className="state-panel__search-icon" aria-hidden>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
                  <path d="m16.5 16.5 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
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

          <div className="state-panel__section-separator" aria-hidden />
          <div className="state-panel__ranking">
            <div className="state-panel__table-head state-panel__table-head--slim state-panel__table-head--title">
              <span className="state-panel__section-title state-panel__section-title--inline">
                STATES RANKING BY OVERALL INDEX
              </span>
            </div>
            <div className="state-panel__table-head state-panel__table-head--slim">
              <span>#</span>
              <span>State</span>
              <span aria-hidden />
              <span className="state-panel__score">Overall Index</span>
            </div>
            <div className="state-panel__table-body state-panel__table-body--slim">
              {/** fixed widths per reference order */}
              {STATIC_RANKING.map((row, idx) => {
                const widthMap = [72, 64, 60, 54, 46, 42, 40, 36];
                const fillWidth = Math.min(80, widthMap[idx] ?? 60);
                return (
                  <button
                    key={row.id}
                    type="button"
                    className={`ranking-row${activeRegionId === row.id ? " is-active" : ""}`}
                    onClick={() => selectRegion(row.id)}
                  >
                    <span className="rank-badge">{idx + 1}</span>
                    <span className="state-name">{row.name}</span>
                    <div className="ranking-progress" aria-hidden>
                      <div
                        className={`ranking-progress-fill ${getProgressTier(row.score)}`}
                        style={{ width: `${fillWidth}px` }}
                      />
                    </div>
                    <span className="score-cell">{row.score.toFixed(1)}</span>
                  </button>
                );
              })}
            </div>
            <div className="state-panel__ranking-cta">
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
          <div className="state-overview__header">
            <h2 className="state-overview__title">INDIA OVERVIEW</h2>
            <p className="state-overview__sub">National level key statistics (2024)</p>
          </div>

          <div className="state-overview__stats-grid">
            {STATS_CARDS.map((card) => (
              <div key={card.key} className="state-overview__stats-card">
                <span 
                  className="state-overview__stats-icon" 
                  style={getIconStyles(card.color)} 
                  aria-hidden
                >
                  {renderStatsIcon(card.key)}
                </span>
                <div className="state-overview__stats-info">
                  <span className="state-overview__stats-value">{card.value}</span>
                  <span className="state-overview__stats-label">
                    {(() => {
                      const lastParenIndex = card.label.lastIndexOf(" (");
                      if (lastParenIndex !== -1) {
                        return (
                          <>
                            <span className="state-overview__stats-label-main">
                              {card.label.substring(0, lastParenIndex)}
                            </span>
                            <span className="state-overview__stats-label-sub">
                              {card.label.substring(lastParenIndex + 1)}
                            </span>
                          </>
                        );
                      }
                      return <span className="state-overview__stats-label-main">{card.label}</span>;
                    })()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="state-panel__section-separator" aria-hidden />

          <div className="state-overview__header state-overview__header--indicators">
            <h2 className="state-overview__title">NATIONAL OVERVIEW</h2>
            <p className="state-overview__sub">Key indicators of India's progress</p>
          </div>
          <div className="state-overview__grid">
            {OVERVIEW_CARDS.map((card) => (
              <div key={card.key} className="state-overview__card">
                <span 
                  className="state-overview__icon" 
                  style={getIconStyles(card.color)} 
                  aria-hidden
                >
                  {renderOverviewIcon(card.key)}
                </span>
                <div className="state-overview__info">
                  <span className="state-overview__value">{card.value}</span>
                  <span className="state-overview__label">
                    {(() => {
                      const lastParenIndex = card.label.lastIndexOf(" (");
                      if (lastParenIndex !== -1) {
                        return (
                          <>
                            <span className="state-overview__label-main">
                              {card.label.substring(0, lastParenIndex)}
                            </span>
                            <span className="state-overview__label-sub">
                              {card.label.substring(lastParenIndex + 1)}
                            </span>
                          </>
                        );
                      }
                      return <span className="state-overview__label-main">{card.label}</span>;
                    })()}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="state-infra-summary">
            <div className="state-infra-summary__header">
              <h3 className="state-infra-summary__title">INFRASTRUCTURE SUMMARY</h3>
              <p className="state-infra-summary__sub">Snapshot of national infrastructure</p>
            </div>
            <div className="state-infra-summary__grid">
              <div className="state-infra-summary__col">
                <div className="state-infra-summary__row-top">
                  <span className="state-infra-summary__icon" aria-hidden>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="5" r="3" fill="currentColor" fillOpacity="0.15" />
                      <line x1="12" y1="8" x2="12" y2="20" />
                      <path d="M5 12h14" />
                      <path d="M12 20a6 6 0 0 1-6-6M12 20a6 6 0 0 0 6-6" />
                    </svg>
                  </span>
                  <span className="state-infra-summary__label">
                    Ports
                    <br />
                    (Major)
                  </span>
                </div>
                <span className="state-infra-summary__value">13</span>
              </div>
              <span className="state-infra-summary__divider" aria-hidden />
              
              <div className="state-infra-summary__col">
                <div className="state-infra-summary__row-top">
                  <span className="state-infra-summary__icon" aria-hidden>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 20V10l5 3V10l5 3V10l10 4v6z" fill="currentColor" fillOpacity="0.15" />
                      <path d="M17 18h1" />
                      <path d="M12 18h1" />
                      <path d="M7 18h1" />
                    </svg>
                  </span>
                  <span className="state-infra-summary__label">
                    Industrial
                    <br />
                    Corridors
                  </span>
                </div>
                <span className="state-infra-summary__value">11</span>
              </div>
              <span className="state-infra-summary__divider" aria-hidden />
              
              <div className="state-infra-summary__col">
                <div className="state-infra-summary__row-top">
                  <span className="state-infra-summary__icon" aria-hidden>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="10" width="8" height="10" rx="1" fill="currentColor" fillOpacity="0.15" />
                      <rect x="14" y="4" width="8" height="16" rx="1" fill="currentColor" fillOpacity="0.15" />
                      <rect x="8" y="12" width="6" height="8" rx="1" fill="currentColor" fillOpacity="0.15" />
                    </svg>
                  </span>
                  <span className="state-infra-summary__label">
                    Smart
                    <br />
                    Cities
                  </span>
                </div>
                <span className="state-infra-summary__value">100</span>
              </div>
              <span className="state-infra-summary__divider" aria-hidden />
              
              <div className="state-infra-summary__col">
                <div className="state-infra-summary__row-top">
                  <span className="state-infra-summary__icon" aria-hidden>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-13-7-13S5 10.7 5 15a7 7 0 0 0 7 7z" fill="currentColor" fillOpacity="0.18" />
                    </svg>
                  </span>
                  <span className="state-infra-summary__label">
                    Water Supply
                    <br />
                    Coverage
                  </span>
                </div>
                <span className="state-infra-summary__value">91.6%</span>
              </div>
            </div>
          </div>

          <div className="state-overview__source-block">
            <div className="state-overview__source-left">
              <span className="state-overview__source-label">Source</span>
              <p className="state-overview__source-text">
                Ministry of Statistics &amp; Programme Implementation, India | Various Ministries &amp; Govt. Sources
              </p>
            </div>
            <div className="state-overview__source-divider" aria-hidden />
            <div className="state-overview__source-right">
              <span className="state-overview__updated-label">Last Updated</span>
              <span className="state-overview__updated-value">20 May 2024</span>
            </div>
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
