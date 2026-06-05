import React from 'react';

const CONTRIBUTORS = [
  {
    colorClass: 'contributor-card__icon--green',
    title: 'Open Source',
    subtitle: 'Community Driven',
  },
  {
    colorClass: 'contributor-card__icon--blue',
    title: 'Researchers',
    subtitle: '& Data Scientists',
  },
  {
    colorClass: 'contributor-card__icon--orange',
    title: 'Government',
    subtitle: 'Collaborators',
  },
  {
    colorClass: 'contributor-card__icon--purple',
    title: 'Developers',
    subtitle: '& Volunteers',
  },
];

function Contributors() {
  return (
    <section className="contributors" id="contributors">
      <div className="contributors__left">
        <p className="eyebrow">CONTRIBUTORS</p>
        <h2 className="section-heading">
          Built by a Community for Bharat
        </h2>
        <p className="section-body">
          Better Bharat Map is an open initiative. Together, we build a
          stronger India.
        </p>
      </div>

      <div className="contributors__right">
        {CONTRIBUTORS.map((card) => (
          <article className="contributor-card" key={card.title}>
            <div
              className={`contributor-card__icon ${card.colorClass}`}
              aria-hidden="true"
            />
            <h3 className="contributor-card__title">{card.title}</h3>
            <p className="contributor-card__subtitle">{card.subtitle}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Contributors;
