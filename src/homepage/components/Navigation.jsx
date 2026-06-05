import React from 'react';

const NAV_STEPS = [
  { label: 'Earth', icon: '🌐', iconClass: 'nav-step__icon--earth' },
  { label: 'India', icon: '◆', iconClass: 'nav-step__icon--india' },
  { label: 'State', icon: '▣', iconClass: 'nav-step__icon--state' },
  { label: 'District', icon: '▢', iconClass: 'nav-step__icon--district' },
  { label: 'Block', icon: '⊞', iconClass: 'nav-step__icon--block' },
  { label: 'Panchayat', icon: '⊡', iconClass: 'nav-step__icon--panchayat' },
  { label: 'Village', icon: '⌂', iconClass: 'nav-step__icon--village' },
];

function Navigation() {
  return (
    <section className="navigation-section" id="earth-to-village">
      <div className="navigation-section__left">
        <p className="eyebrow">EARTH TO VILLAGE NAVIGATION</p>
        <h2 className="section-heading">
          From Earth to Every Village in India
        </h2>
        <p className="section-body">
          Seamless geographic navigation for intelligence at every level.
        </p>
      </div>

      <div className="navigation-section__right">
        <div className="nav-chain">
          {NAV_STEPS.map((step, index) => (
            <React.Fragment key={step.label}>
              <div className="nav-step">
                <div
                  className={`nav-step__icon ${step.iconClass}`}
                  aria-hidden="true"
                >
                  {step.icon}
                </div>
                <span className="nav-step__label">{step.label}</span>
              </div>
              {index < NAV_STEPS.length - 1 && (
                <span className="nav-step__arrow" aria-hidden="true">
                  →
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Navigation;
