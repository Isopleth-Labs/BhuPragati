const CAPABILITIES = [
  {
    iconClass: "capability-strip__icon--infrastructure",
    label: "Infrastructure",
    desc: "Monitoring major assets",
  },
  {
    iconClass: "capability-strip__icon--budget",
    label: "Budget Intelligence",
    desc: "Tracking public expenditure",
  },
  {
    iconClass: "capability-strip__icon--environment",
    label: "Environment",
    desc: "Air, water & land insights",
  },
  {
    iconClass: "capability-strip__icon--transport",
    label: "Transportation",
    desc: "Roads, rail & mobility",
  },
  {
    iconClass: "capability-strip__icon--social",
    label: "Social Development",
    desc: "Education, employment & more",
  },
];

function CapabilityStrip() {
  return (
    <section className="capability-strip" aria-label="Platform capabilities">
      <div className="capability-strip__inner">
        {CAPABILITIES.map((item) => (
          <article className="capability-strip__item" key={item.label}>
            <span
              className={`capability-strip__icon ${item.iconClass}`}
              aria-hidden="true"
            />
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
