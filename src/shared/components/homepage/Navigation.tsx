import React from "react"

import {
	BlockIcon,
	DistrictIcon,
	EarthIcon,
	IndiaIcon,
	PanchayatIcon,
	StateIcon,
	VillageIcon,
} from "./Icons"

const NAV_STEPS = [
	{
		label: "Earth",
		icon: <EarthIcon />,
		iconClass: "nav-step__icon--earth",
		size: 44,
	},
	{
		label: "India",
		icon: <IndiaIcon />,
		iconClass: "nav-step__icon--india",
		size: 44,
	},
	{
		label: "State",
		icon: <StateIcon />,
		iconClass: "nav-step__icon--state",
		size: 42,
	},
	{
		label: "District",
		icon: <DistrictIcon />,
		iconClass: "nav-step__icon--district",
		size: 40,
	},
	{
		label: "Block",
		icon: <BlockIcon />,
		iconClass: "nav-step__icon--block",
		size: 42,
	},
	{
		label: "Panchayat",
		icon: <PanchayatIcon />,
		iconClass: "nav-step__icon--panchayat",
		size: 44,
	},
	{
		label: "Village",
		icon: <VillageIcon />,
		iconClass: "nav-step__icon--village",
		size: 44,
	},
]

function Navigation() {
	return (
		<section className="section-row navigation-section" id="earth-to-village">
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
									{React.cloneElement(step.icon, {
										width: step.size,
										height: step.size,
									})}
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
	)
}

export default Navigation
