import React from 'react';

const STEPS = [
  {
    title: 'Current State',
    description: 'Understand existing realities with data and maps.',
    visualClass: 'sim-card__visual sim-card__visual--current',
  },
  {
    title: 'Investment Scenario',
    description: 'Model investments across sectors and regions.',
    visualClass: 'sim-card__visual sim-card__visual--invest',
  },
  {
    title: 'Projected Outcome',
    description: 'Visualize and measure the future impact.',
    visualClass: 'sim-card__visual sim-card__visual--outcome',
  },
];

function Simulation() {
  return (
    <section className="simulation" id="simulation">
      <div className="simulation__left">
        <p className="eyebrow">DEVELOPMENT SIMULATION</p>
        <h2 className="section-heading">Plan Today, Transform Tomorrow</h2>
        <p className="section-body">
          Simulate infrastructure investments and see the projected impact
          before it happens.
        </p>
        <a href="#simulation-tool" className="btn btn-ghost" id="sim-explore-btn">
          EXPLORE SIMULATION &gt;
        </a>
      </div>

      <div className="simulation__right">
        <div className="sim-flow">
          {STEPS.map((step, index) => (
            <React.Fragment key={step.title}>
              <article className="sim-card">
                <div className={step.visualClass} aria-hidden="true" />
                <h3 className="sim-card__title">{step.title}</h3>
                <p className="sim-card__desc">{step.description}</p>
              </article>
              {index < STEPS.length - 1 && (
                <span className="sim-flow__arrow" aria-hidden="true">
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

export default Simulation;
