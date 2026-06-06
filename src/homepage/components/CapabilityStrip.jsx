import React from 'react';

const CAPABILITIES = [
  {
    icon: (
      <svg className="capability-strip__svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 22L8 2M20 22l-4-20" />
        <line x1="12" y1="4" x2="12" y2="8" strokeDasharray="2 2" />
        <line x1="12" y1="12" x2="12" y2="16" strokeDasharray="2 2" />
      </svg>
    ),
    label: "Infrastructure",
    desc: "Monitoring major assets",
    color: "var(--brand-blue)",
  },
  {
    icon: (
      <svg className="capability-strip__svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>
        <path d="M22 12A10 10 0 0 0 12 2v10z"/>
      </svg>
    ),
    label: "Budget Intelligence",
    desc: "Tracking public expenditure",
    color: "#27ffd0",
  },
  {
    icon: (
      <svg className="capability-strip__svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </svg>
    ),
    label: "Environment",
    desc: "Air, water & land insights",
    color: "#54d38a",
  },
  {
    icon: (
      <svg className="capability-strip__svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect width="16" height="16" x="4" y="3" rx="2"/>
        <path d="M4 11h16"/><path d="M12 3v8"/><path d="M8 19l-2 3"/>
        <path d="M18 22l-2-3"/><path d="M8 15h.01"/><path d="M16 15h.01"/>
      </svg>
    ),
    label: "Transportation",
    desc: "Roads, rail & mobility",
    color: "#ffd34d",
  },
  {
    icon: (
      <svg className="capability-strip__svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    label: "Social Development",
    desc: "Education, employment & more",
    color: "#ff6b57",
  },
];

function CapabilityStrip() {
  return (
    <section className="capability-strip" aria-label="Platform capabilities">
      <div className="capability-strip__inner">
        {CAPABILITIES.map((item) => (
          <article className="capability-strip__item" key={item.label}>
            <div className="capability-strip__icon-container" style={{ color: item.color }}>
              {item.icon}
            </div>
            <div>
              <p className="capability-strip__label">{item.label}</p>
              <p className="capability-strip__desc">{item.desc}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default CapabilityStrip;
