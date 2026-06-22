import {
	Eyebrow,
	SectionBody,
	SectionHeading,
} from "@/shared/components/homepage/shared"
import { cn } from "@/shared/lib/utils"

const CONTRIBUTORS = [
	{
		iconBase:
			"text-[#7cf3c5] bg-[rgba(124,243,197,0.15)] border border-[rgba(124,243,197,0.35)]",
		iconHover:
			"group-hover:bg-[rgba(124,243,197,0.22)] group-hover:border-[rgba(124,243,197,0.5)] group-hover:drop-shadow-[0_0_10px_rgba(124,243,197,0.6)]",
		title: "Open Source",
		subtitle: "Community Driven",
		icon: (
			<svg
				width="30"
				height="30"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.75"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<title>Open Source</title>
				<rect x="16" y="16" width="6" height="6" rx="1.5" />
				<rect x="2" y="16" width="6" height="6" rx="1.5" />
				<rect x="9" y="2" width="6" height="6" rx="1.5" />
				<path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
				<path d="M12 12V8" />
			</svg>
		),
	},
	{
		iconBase:
			"text-[#6ad1ff] bg-[rgba(106,209,255,0.15)] border border-[rgba(106,209,255,0.35)]",
		iconHover:
			"group-hover:bg-[rgba(106,209,255,0.22)] group-hover:border-[rgba(106,209,255,0.5)] group-hover:drop-shadow-[0_0_10px_rgba(106,209,255,0.6)]",
		title: "Researchers",
		subtitle: "& Data Scientists",
		icon: (
			<svg
				width="30"
				height="30"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.75"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<title>Researchers</title>
				<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
				<circle cx="9" cy="7" r="4" />
				<circle cx="18" cy="11" r="3" />
				<path d="M20 13l2 2" />
			</svg>
		),
	},
	{
		iconBase:
			"text-[#ffd700] bg-[rgba(255,215,0,0.15)] border border-[rgba(255,215,0,0.35)]",
		iconHover:
			"group-hover:bg-[rgba(255,215,0,0.22)] group-hover:border-[rgba(255,215,0,0.5)] group-hover:drop-shadow-[0_0_10px_rgba(255,215,0,0.6)]",
		title: "Government",
		subtitle: "Collaborators",
		icon: (
			<svg
				width="30"
				height="30"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.75"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<title>Government</title>
				<line x1="3" x2="21" y1="22" y2="22" />
				<line x1="6" x2="6" y1="18" y2="11" />
				<line x1="10" x2="10" y1="18" y2="11" />
				<line x1="14" x2="14" y1="18" y2="11" />
				<line x1="18" x2="18" y1="18" y2="11" />
				<polygon points="12 2 20 7 4 7" />
			</svg>
		),
	},
	{
		iconBase:
			"text-[#b182ff] bg-[rgba(177,130,255,0.15)] border border-[rgba(177,130,255,0.35)]",
		iconHover:
			"group-hover:bg-[rgba(177,130,255,0.22)] group-hover:border-[rgba(177,130,255,0.5)] group-hover:drop-shadow-[0_0_10px_rgba(177,130,255,0.6)]",
		title: "Developers",
		subtitle: "& Volunteers",
		icon: (
			<svg
				width="30"
				height="30"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.75"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<title>Developers</title>
				<rect x="2" y="4" width="20" height="16" rx="3" />
				<path d="M9 10l-2 2 2 2" />
				<path d="M15 10l2 2-2 2" />
			</svg>
		),
	},
]

function Contributors() {
	return (
		<section
			className="grid [grid-template-columns:360px_minmax(0,1fr)] items-start [column-gap:48px] py-[40px] px-[40px] w-full max-w-[min(1800px,92vw)] mx-auto scroll-mt-20 max-[900px]:[grid-template-columns:1fr] max-[900px]:py-[28px] max-[900px]:px-[24px] max-[900px]:[row-gap:28px] max-[720px]:px-[18px] max-[480px]:py-[20px] max-[480px]:px-[16px] max-[480px]:[row-gap:20px]"
			id="contributors"
		>
			{/* Left */}
			<div className="self-start flex flex-col">
				<Eyebrow className="text-[#f7c64b]">CONTRIBUTORS</Eyebrow>
				<SectionHeading>
					Built for Bharat,
					<br />
					Together
				</SectionHeading>
				<SectionBody>
					Better Bharat Map is an open initiative dedicated to data-driven
					development across India. Developers, researchers, institutions, and
					citizens are welcome to contribute and help build a stronger Bharat.
				</SectionBody>
			</div>

			{/* Right: 4-col card grid */}
			<div className="self-start grid [grid-template-columns:repeat(4,minmax(0,1fr))] gap-[24px] max-[900px]:grid-cols-2 max-[720px]:grid-cols-1">
				{CONTRIBUTORS.map((card) => (
					<article
						key={card.title}
						className={cn(
							"group flex flex-row items-center gap-[16px] h-[92px] p-[12px_20px]",
							"bg-[linear-gradient(180deg,rgba(14,20,32,0.78),rgba(7,14,24,0.9))]",
							"border border-[rgba(146,197,255,0.12)] rounded-[14px]",
							"shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_10px_30px_rgba(0,0,0,0.24)]",
							"transition-[transform,border-color,box-shadow] duration-300",
							"hover:-translate-y-[3px] hover:border-[rgba(146,197,255,0.3)]",
							"hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_15px_40px_rgba(0,0,0,0.35)]",
						)}
					>
						<div
							aria-hidden="true"
							className={cn(
								"flex-shrink-0 flex items-center justify-center w-[64px] h-[64px] rounded-[16px]",
								"transition-[background,border-color,filter] duration-300 ease",
								card.iconBase,
								card.iconHover,
							)}
						>
							{card.icon}
						</div>
						<div className="flex flex-col justify-center">
							<h3 className="m-0 mb-[2px] text-[16px] font-bold text-white">
								{card.title}
							</h3>
							<p className="m-0 text-[13px] leading-[1.3] text-[#9fb0c8]">
								{card.subtitle}
							</p>
						</div>
					</article>
				))}
			</div>
		</section>
	)
}

export default Contributors
