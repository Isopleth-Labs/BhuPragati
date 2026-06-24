const CAPABILITIES = [
	{
		icon: (
			<svg
				className="w-full h-full"
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
		label: "Infrastructure",
		desc: "Monitoring major assets",
		color: "var(--brand-blue)",
	},
	{
		icon: (
			<svg
				className="w-full h-full"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
				<path d="M22 12A10 10 0 0 0 12 2v10z" />
			</svg>
		),
		label: "Budget Intelligence",
		desc: "Tracking public expenditure",
		color: "#27ffd0",
	},
	{
		icon: (
			<svg
				className="w-full h-full"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
				<path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
			</svg>
		),
		label: "Environment",
		desc: "Air, water & land insights",
		color: "#54d38a",
	},
	{
		icon: (
			<svg
				className="w-full h-full"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<rect width="16" height="16" x="4" y="3" rx="2" />
				<path d="M4 11h16" />
				<path d="M12 3v8" />
				<path d="M8 19l-2 3" />
				<path d="M18 22l-2-3" />
				<path d="M8 15h.01" />
				<path d="M16 15h.01" />
			</svg>
		),
		label: "Transportation",
		desc: "Roads, rail & mobility",
		color: "#ffd34d",
	},
	{
		icon: (
			<svg
				className="w-full h-full"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
				<circle cx="9" cy="7" r="4" />
				<path d="M22 21v-2a4 4 0 0 0-3-3.87" />
				<path d="M16 3.13a4 4 0 0 1 0 7.75" />
			</svg>
		),
		label: "Social Development",
		desc: "Education, employment & more",
		color: "#ff6b57",
	},
]

function CapabilityStrip() {
	return (
		<section
			className="absolute right-0 bottom-0 left-0 z-6 px-[clamp(30px,4.8vw,78px)] py-0 pb-4 mt-0 bg-transparent max-[720px]:px-[18px] max-[720px]:pb-[18px]"
			aria-label="Platform capabilities"
		>
			<div className="grid grid-cols-5 max-w-[1280px] min-h-[88px] mx-auto my-0 overflow-hidden bg-gradient-to-b from-[rgba(8,12,20,0.35)] to-[rgba(4,8,16,0.28)] border border-solid border-[rgba(255,255,255,0.08)] rounded-lg [box-shadow:inset_0_1px_0_rgba(255,255,255,0.03),0_8px_32px_rgba(0,0,0,0.2)] max-[980px]:flex max-[980px]:overflow-x-auto max-[980px]:snap-x max-[980px]:snap-mandatory max-[980px]:[scrollbar-width:none] max-[980px]:[&::-webkit-scrollbar]:hidden max-[980px]:[mask-image:linear-gradient(90deg,transparent_0,#000_24px,#000_calc(100%-24px),transparent_100%)] max-[720px]:min-h-[72px]">
				{CAPABILITIES.map((item) => (
					<article
						className="relative flex gap-[18px] items-center min-w-0 px-[clamp(18px,2vw,28px)] py-5 first:border-l-0 border-l border-solid border-[rgba(255,255,255,0.07)] max-[980px]:shrink-0 max-[980px]:min-w-[220px] max-[980px]:snap-start max-[720px]:min-w-[196px] max-[720px]:px-4 max-[720px]:py-3.5 max-[480px]:min-w-[180px] max-[480px]:px-3.5 max-[480px]:py-3"
						key={item.label}
					>
						<div
							className="flex shrink-0 items-center justify-center w-[34px] h-[34px] opacity-95 scale-115 origin-center max-[720px]:w-[30px] max-[720px]:h-[30px]"
							style={{ color: item.color }}
						>
							{item.icon}
						</div>
						<div>
							<p className="text-[14px] font-bold leading-[1.15] text-[var(--text)] uppercase tracking-0 max-[720px]:text-[10px] max-[480px]:text-[9px]">
								{item.label}
							</p>
							<p className="mt-[3px] text-[11.5px] leading-[1.3] text-[#8fa0b5] max-[720px]:text-[9px]">
								{item.desc}
							</p>
						</div>
					</article>
				))}
			</div>
		</section>
	)
}

export default CapabilityStrip
