import React from 'react';

const INSIGHT_CARDS = [
  {
    colorClass: 'insight-card__icon--orange',
    title: 'Infrastructure Gaps',
    description:
      'Identify critical gaps in roads, healthcare, education, electricity and more.',
  },
  {
    colorClass: 'insight-card__icon--blue',
    title: 'Better Decisions',
    description:
      'Empower data-backed decisions for stronger policies and outcomes.',
  },
  {
    colorClass: 'insight-card__icon--green',
    title: 'Transparent Governance',
    description:
      'Open data and clear insights ensure accountability and public trust.',
  },
  {
    colorClass: 'insight-card__icon--purple',
    title: 'Inclusive Growth',
    description:
      'Target resources where they are needed most for equitable development.',
  },
];

function WhyItMatters() {
  return (
    <section className="why-it-matters" id="why-it-matters">
      <div className="why-it-matters__left">
        <p className="eyebrow">WHY IT MATTERS</p>
        <h2 className="section-heading">
          Building a Better Bharat Through Intelligence
        </h2>
        <p className="section-body">
          Data-driven insights help us identify gaps, unlock opportunities and
          ensure no one is left behind.
        </p>
        <a href="#insights" className="btn btn-ghost" id="why-explore-btn">
          EXPLORE INSIGHTS &gt;
        </a>
      </div>

      <div className="why-it-matters__right">
        {INSIGHT_CARDS.map((card) => (
          <article className="insight-card" key={card.title}>
            <div
              className={`insight-card__icon ${card.colorClass}`}
              aria-hidden="true"
            />
            <h3 className="insight-card__title">{card.title}</h3>
            <p className="insight-card__desc">{card.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default WhyItMatters;
