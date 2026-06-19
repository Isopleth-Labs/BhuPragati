import React from "react"
import { cn } from "@/shared/lib/utils"
import { Eyebrow, SectionBody, SectionHeading } from "@/shared/components/homepage/shared"
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
	{ label: "Earth", icon: <EarthIcon /> },
	{ label: "India", icon: <IndiaIcon /> },
	{ label: "State", icon: <StateIcon /> },
	{ label: "District", icon: <DistrictIcon /> },
	{ label: "Block", icon: <BlockIcon /> },
	{ label: "Panchayat", icon: <PanchayatIcon /> },
	{ label: "Village", icon: <VillageIcon /> },
]

function Navigation() {
	return (
		<section
			className="grid [grid-template-columns:360px_minmax(0,1fr)] gap-[20px] py-[60px] px-[40px] w-full max-w-[min(1800px,92vw)] mx-auto scroll-mt-20 max-[900px]:[grid-template-columns:1fr] max-[900px]:py-[40px] max-[900px]:px-[24px] max-[900px]:[row-gap:28px] max-[720px]:py-[28px] max-[720px]:px-[18px] max-[480px]:py-[28px] max-[480px]:px-[16px] max-[480px]:[row-gap:20px]"
			id="earth-to-village"
		>
			{/* Left */}
			<div className="self-start flex flex-col">
				<Eyebrow>EARTH TO VILLAGE NAVIGATION</Eyebrow>
				<SectionHeading>From Earth to Every Village in India</SectionHeading>
				<SectionBody>
					Seamless geographic navigation for intelligence at every level.
				</SectionBody>
			</div>

			{/* Right: icon chain */}
			<div className="self-start mt-[15px]">
				<div
					className={cn(
						// desktop: evenly spaced horizontal chain, icons top-aligned
						"flex items-start justify-between w-full",
						// mobile: horizontal scroll with snap
						"max-[720px]:relative max-[720px]:flex-nowrap max-[720px]:gap-[22px] max-[720px]:justify-start",
						"max-[720px]:p-[4px_8px_10px] max-[720px]:overflow-x-auto",
						"max-[720px]:[scroll-snap-type:x_mandatory] max-[720px]:[scrollbar-width:none]",
						"max-[720px]:[&::-webkit-scrollbar]:hidden",
						"max-[720px]:[mask-image:linear-gradient(90deg,transparent_0,#000_24px,#000_calc(100%_-_24px),transparent_100%)]",
						// horizontal rule behind icons row on mobile
						"max-[720px]:before:absolute max-[720px]:before:top-[26px]",
						"max-[720px]:before:right-2 max-[720px]:before:left-2 max-[720px]:before:z-0",
						"max-[720px]:before:h-px max-[720px]:before:content-[''] max-[720px]:before:bg-[rgba(255,255,255,0.16)]",
					)}
				>
					{NAV_STEPS.map((step, index) => (
						<React.Fragment key={step.label}>
							<div
								className={cn(
									"flex flex-col gap-[10px] items-center",
									"max-[720px]:relative max-[720px]:z-[1] max-[720px]:flex-shrink-0",
									"max-[720px]:min-w-[76px] max-[720px]:[scroll-snap-align:start]",
								)}
							>
								{/* Icon container: fixed 52×52, SVG constrained via child selector */}
								<div
									className={cn(
										"flex items-center justify-center w-[52px] h-[52px]",
										"text-[#8ce0ff] drop-shadow-[0_0_8px_rgba(100,200,255,0.1)]",
										"[&_svg]:block [&_svg]:w-full [&_svg]:h-full [&_svg]:overflow-hidden",
										"max-[720px]:w-[40px] max-[720px]:h-[40px]",
									)}
									aria-hidden="true"
								>
									{step.icon}
								</div>

								<span className="text-[16px] font-medium leading-[1.2] text-[rgba(255,255,255,0.92)] text-center max-[720px]:text-[10px]">
									{step.label}
								</span>
							</div>

							{index < NAV_STEPS.length - 1 && (
								<span
									className="flex items-center justify-center w-[48px] h-[52px] mx-[4px] text-[24px] text-[rgba(255,255,255,0.4)] flex-shrink-0 max-[720px]:hidden"
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
