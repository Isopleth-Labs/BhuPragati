import React from 'react';

const LAYERS = [
  {
    colorClass: 'layer-card__icon--gray',
    title: 'Roads',
    description: 'Connectivity and accessibility intelligence',
  },
  {
    colorClass: 'layer-card__icon--red',
    title: 'Healthcare',
    description: 'Facilities, access and service availability',
  },
  {
    colorClass: 'layer-card__icon--blue',
    title: 'Education',
    description: 'Schools, colleges and learning infrastructure',
  },
  {
    colorClass: 'layer-card__icon--cyan',
    title: 'Flood Intelligence',
    description: 'Risk mapping and vulnerability analysis',
  },
  {
    colorClass: 'layer-card__icon--green',
    title: 'Agriculture',
    description: 'Irrigation, land use and productivity insights',
  },
  {
    colorClass: 'layer-card__icon--yellow',
    title: 'Electricity',
    description: 'Power access, infrastructure and reliability',
  },
];

function Infrastructure() {
  return (
    <section className="infrastructure" id="infrastructure">
      <div className="infrastructure__left">
        <p className="eyebrow">INFRASTRUCTURE INTELLIGENCE</p>
        <h2 className="section-heading">
          Layers That Power Better Decisions
        </h2>
      </div>

      <div className="infrastructure__right">
        {LAYERS.map((layer) => (
          <article className="layer-card" key={layer.title}>
            <div
              className={`layer-card__icon ${layer.colorClass}`}
              aria-hidden="true"
            />
            <h3 className="layer-card__title">{layer.title}</h3>
            <p className="layer-card__desc">{layer.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Infrastructure;
