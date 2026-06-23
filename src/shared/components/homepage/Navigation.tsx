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
		<section
			className="section-row navigation-section gap-5 pt-[60px] pb-[60px] max-[900px]:pt-[40px] max-[900px]:pb-[40px] max-[480px]:pt-[28px] max-[480px]:pb-[28px]"
			id="earth-to-village"
		>
			<div className="navigation-section__left self-start">
				<p className="eyebrow">EARTH TO VILLAGE NAVIGATION</p>
				<h2 className="section-heading mt-2.5 mx-0 mb-3 text-[clamp(26px,3.2vw,34px)] leading-[1.2] font-extrabold">
					From Earth to Every Village in India
				</h2>
				<p className="section-body max-w-[360px] text-[14px] leading-[1.65] text-[var(--muted)]">
					Seamless geographic navigation for intelligence at every level.
				</p>
			</div>

			<div className="navigation-section__right mt-[15px] self-start w-full">
				<div className="nav-chain flex items-start justify-between w-full max-[720px]:relative max-[720px]:flex-nowrap max-[720px]:gap-[22px] max-[720px]:justify-start max-[720px]:p-[4px_8px_10px] max-[720px]:overflow-x-auto max-[720px]:snap-x max-[720px]:snap-mandatory max-[720px]:[scrollbar-width:none] max-[720px]:[&::-webkit-scrollbar]:hidden max-[720px]:[mask-image:linear-gradient(90deg,transparent_0,#000_24px,#000_calc(100%-24px),transparent_100%)] max-[720px]:before:absolute max-[720px]:before:top-[26px] max-[720px]:before:right-2 max-[720px]:before:left-2 max-[720px]:before:z-0 max-[720px]:before:h-[1px] max-[720px]:before:bg-[rgba(255,255,255,0.16)] max-[720px]:before:content-['']">
					{NAV_STEPS.map((step, index) => (
						<React.Fragment key={step.label}>
							<div className="nav-step flex flex-col gap-2.5 items-center max-[720px]:relative max-[720px]:z-[1] max-[720px]:shrink-0 max-[720px]:min-w-[76px] max-[720px]:snap-start">
								<div
									className={`nav-step__icon flex items-center justify-center w-[52px] h-[52px] text-[#8ce0ff] bg-transparent border-none [box-shadow:none] [filter:drop-shadow(0_0_8px_rgba(100,200,255,0.1))] max-[720px]:w-10 max-[720px]:h-10 [&_svg]:overflow-hidden ${step.iconClass}`}
									aria-hidden="true"
								>
									{React.cloneElement(step.icon, {
										width: step.size,
										height: step.size,
									})}
								</div>
								<span className="nav-step__label text-[16px] font-medium leading-[1.2] text-[rgba(255,255,255,0.92)] text-center max-[720px]:text-[10px]">
									{step.label}
								</span>
							</div>
							{index < NAV_STEPS.length - 1 && (
								<span
									className="nav-step__arrow flex items-center justify-center w-12 h-[52px] mx-1 my-0 text-[24px] text-[rgba(255,255,255,0.4)] max-[720px]:hidden"
									aria-hidden="true"
								>
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
