import React from "react";

const LAYERS = [
	{
		icon: (
			<svg
				className="layer-card__icon layer-card__icon--blue"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<path d="M4 22L8 2M20 22l-4-20" />
				<line x1="12" y1="4" x2="12" y2="8" strokeDasharray="2 2" />
				<line x1="12" y1="12" x2="12" y2="16" strokeDasharray="2 2" />
			</svg>
		),
		title: "Roads",
		description: "Connectivity and accessibility intelligence",
	},
	{
		icon: (
			<svg
				className="layer-card__icon layer-card__icon--red"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<circle cx="12" cy="12" r="10" />
				<line x1="12" y1="8" x2="12" y2="16" />
				<line x1="8" y1="12" x2="16" y2="12" />
			</svg>
		),
		title: "Healthcare",
		description: "Facilities, access and service availability",
	},
	{
		icon: (
			<svg
				className="layer-card__icon layer-card__icon--yellow"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<path d="M22 10v6M2 10l10-5 10 5-10 5z" />
				<path d="M6 12v5c0 2 2.7 3.5 6 3.5s6-1.5 6-3.5v-5" />
			</svg>
		),
		title: "Education",
		description: "Schools, colleges and learning infrastructure",
	},
	{
		icon: (
			<svg
				className="layer-card__icon layer-card__icon--cyan"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<path d="M3 10L12 3l9 7" />
				<path d="M5 10v7" />
				<path d="M19 10v7" />
				<path d="M2 15c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
				<path d="M2 20c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
			</svg>
		),
		title: "Flood Intelligence",
		description: "Risk mapping and vulnerability analysis",
	},
	{
		icon: (
			<svg
				className="layer-card__icon layer-card__icon--green"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<path d="M2 22 16 8" />
				<path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" />
				<path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" />
				<path d="M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" />
				<path d="M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z" />
				<path d="M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z" />
				<path d="M15.47 13.47 17 15l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z" />
				<path d="M19.47 9.47 21 11l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L13 11l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z" />
			</svg>
		),
		title: "Agriculture",
		description: "Irrigation, land use and productivity insights",
	},
	{
		icon: (
			<svg
				className="layer-card__icon layer-card__icon--yellow"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<g transform="translate(0.5, -1.5)">
					<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
				</g>
			</svg>
		),
		title: "Electricity",
		description: "Power access, grid infrastructure and reliability.",
	},
];

function Infrastructure() {
	return (
		<section className="section-row infrastructure" id="infrastructure">
			<div className="infrastructure__left">
				<p className="eyebrow infrastructure__eyebrow">
					INFRASTRUCTURE INTELLIGENCE
				</p>
				<h2 className="section-heading">
					Layers That Power
					<br />
					Better Decisions
				</h2>
			</div>

			<div className="infrastructure__right">
				{LAYERS.map((layer) => (
					<article className="layer-card infrastructure-card" key={layer.title}>
						{layer.icon}
						<h3 className="layer-card__title">{layer.title}</h3>
						<p className="layer-card__desc">{layer.description}</p>
					</article>
				))}
			</div>
		</section>
	);
}

export default Infrastructure;
