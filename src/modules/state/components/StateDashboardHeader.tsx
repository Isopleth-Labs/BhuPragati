interface StateDashboardHeaderProps {
	resolvedMode: "day" | "night"
	onToggleTheme: () => void
}

export default function StateDashboardHeader({
	resolvedMode,
	onToggleTheme,
}: StateDashboardHeaderProps) {
	return (
		<header className="z-10 grid grid-cols-[1fr_auto_1fr] items-center h-[72px] px-8 bg-[rgba(3,8,20,0.94)] border-b border-b-[rgba(120,160,220,0.12)] shadow-[0_4px_30px_rgba(0,0,0,0.4)] backdrop-blur-[20px] [[data-theme='light']_&]:bg-[rgba(255,255,255,0.9)] [[data-theme='light']_&]:border-b-[rgba(15,23,42,0.08)]">
			<div className="flex gap-[14px] items-center justify-self-start">
				<div
					className="flex items-center justify-center w-[38px] h-[38px]"
					aria-hidden="true"
				>
					<svg
						width="34"
						height="34"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<title id="Better Bharat Map">Statedb</title>
						<defs>
							<linearGradient
								id="brand-logo-grad"
								x1="0%"
								y1="0%"
								x2="100%"
								y2="100%"
							>
								<stop offset="0%" stopColor="#1f92ff" />
								<stop offset="100%" stopColor="#22d3ee" />
							</linearGradient>
							<linearGradient
								id="brand-logo-grad-2"
								x1="0%"
								y1="0%"
								x2="100%"
								y2="100%"
							>
								<stop offset="0%" stopColor="#00f2fe" />
								<stop offset="100%" stopColor="#4ade80" />
							</linearGradient>
						</defs>
						<path
							d="M4 12V8L8 4H14A4 4 0 0 1 18 8A4 4 0 0 1 14 12H4"
							stroke="url(#brand-logo-grad)"
							strokeWidth="2.8"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M4 12H14A4 4 0 0 1 18 16A4 4 0 0 1 14 20H8L4 16V12"
							stroke="url(#brand-logo-grad-2)"
							strokeWidth="2.8"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</div>
				<div className="state-brand__text">
					<h1 className="m-0 text-[20px] font-extrabold leading-[1.2] text-[rgba(255,255,255,0.94)] tracking-[0.04em] [[data-theme='light']_&]:text-[#0f172a]">
						BETTER BHARAT MAP
					</h1>
					<p className="mt-[2px] mr-0 mb-0 ml-0 text-[11.5px] font-medium leading-[1.2] text-[rgba(255,255,255,0.88)] tracking-[0.02em] [[data-theme='light']_&]:text-[rgba(15,23,42,0.75)]">
						State Intelligence Platform
					</p>
				</div>
			</div>

			<div className="relative justify-self-center w-[440px]">
				<input
					className="w-full h-[42px] py-[10px] pr-[42px] pl-[18px] text-[14px] text-white bg-[rgba(4,9,20,0.75)] border border-[rgba(120,160,220,0.16)] rounded-[10px] transition-all duration-250 ease-[cubic-bezier(0.4,0,0.2,1)] focus:outline-none focus:bg-[rgba(4,9,20,0.9)] focus:border-[rgba(56,189,248,0.4)] focus:shadow-[0_0_14px_rgba(56,189,248,0.15)] placeholder:text-[rgba(255,255,255,0.65)] [[data-theme='light']_&]:text-[#0f172a] [[data-theme='light']_&]:bg-[rgba(255,255,255,0.9)] [[data-theme='light']_&]:border-[rgba(15,23,42,0.12)] [[data-theme='light']_&]:placeholder:text-[rgba(15,23,42,0.62)]"
					placeholder="Search State..."
					aria-label="Search state"
				/>
				<span
					className="absolute top-1/2 right-[14px] flex items-center text-[rgba(255,255,255,0.65)] pointer-events-none -translate-y-1/2 [[data-theme='light']_&]:text-[rgba(15,23,42,0.68)]"
					aria-hidden="true"
				>
					<svg
						width="15"
						height="15"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<title>Search</title>
						<circle cx="11" cy="11" r="8" />
						<line x1="21" y1="21" x2="16.65" y2="16.65" />
					</svg>
				</span>
			</div>

			<div className="flex gap-[10px] items-center justify-self-end">
				<button
					type="button"
					className="flex gap-3 items-center h-[42px] px-4 text-white cursor-pointer select-none bg-[rgba(4,9,20,0.75)] border border-[rgba(120,160,220,0.16)] rounded-[10px] transition-all duration-200 ease hover:bg-[rgba(4,9,20,0.9)] hover:border-[rgba(56,189,248,0.35)] [[data-theme='light']_&]:text-[#0f172a] [[data-theme='light']_&]:bg-[rgba(255,255,255,0.9)] [[data-theme='light']_&]:border-[rgba(15,23,42,0.12)]"
				>
					<span
						className="flex items-center text-[rgba(255,255,255,0.85)]"
						aria-hidden="true"
					>
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<title>Calendar</title>
							<rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
							<line x1="16" y1="2" x2="16" y2="6" />
							<line x1="8" y1="2" x2="8" y2="6" />
							<line x1="3" y1="10" x2="21" y2="10" />
							<path
								d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"
								strokeWidth="2"
							/>
						</svg>
					</span>
					<div className="flex flex-col leading-[1.15] text-left">
						<span className="text-[10px] font-medium text-[rgba(255,255,255,0.88)] [[data-theme='light']_&]:text-[rgba(15,23,42,0.72)]">
							Data Year
						</span>
						<span className="text-[13.5px] font-bold text-white [[data-theme='light']_&]:text-[#0f172a]">
							2024
						</span>
					</div>
				</button>

				<button
					type="button"
					className="inline-flex gap-2 items-center h-[42px] px-4 text-[13.5px] font-medium text-white cursor-pointer bg-[rgba(4,9,20,0.75)] border border-[rgba(120,160,220,0.16)] rounded-[10px] transition-all duration-200 ease hover:bg-[rgba(4,9,20,0.9)] hover:border-[rgba(56,189,248,0.35)] [[data-theme='light']_&]:text-[#0f172a] [[data-theme='light']_&]:bg-[rgba(255,255,255,0.9)] [[data-theme='light']_&]:border-[rgba(15,23,42,0.12)]"
				>
					<span
						aria-hidden="true"
						className="flex items-center text-[rgba(255,255,255,0.85)] [[data-theme='light']_&]:text-[rgba(15,23,42,0.75)]"
					>
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<title>Fit to India</title>
							<path d="M3 7V5a2 2 0 0 1 2-2h2" />
							<path d="M17 3h2a2 2 0 0 1 2 2v2" />
							<path d="M21 17v2a2 2 0 0 1-2 2h-2" />
							<path d="M3 17v2a2 2 0 0 1 2 2h2" />
							<path d="M8 10l3-2 5 3 2-2v7l-2 2-5-3-3 2z" strokeWidth="1.5" />
						</svg>
					</span>
					<span>Fit to India</span>
				</button>

				<button
					type="button"
					className="inline-flex gap-2 items-center h-[42px] px-4 text-[13.5px] font-medium text-white cursor-pointer bg-[rgba(4,9,20,0.75)] border border-[rgba(120,160,220,0.16)] rounded-[10px] transition-all duration-200 ease hover:bg-[rgba(4,9,20,0.9)] hover:border-[rgba(56,189,248,0.35)] [[data-theme='light']_&]:text-[#0f172a] [[data-theme='light']_&]:bg-[rgba(255,255,255,0.9)] [[data-theme='light']_&]:border-[rgba(15,23,42,0.12)]"
				>
					<span
						aria-hidden="true"
						className="flex items-center text-[rgba(255,255,255,0.85)] [[data-theme='light']_&]:text-[rgba(15,23,42,0.75)]"
					>
						<svg
							width="15"
							height="15"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<title>Export</title>
							<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
							<polyline points="7 10 12 15 17 10" />
							<line x1="12" y1="15" x2="12" y2="3" />
						</svg>
					</span>
					<span>Export</span>
					<span
						aria-hidden="true"
						className="flex items-center -ml-[2px] text-[rgba(255,255,255,0.88)] [[data-theme='light']_&]:text-[rgba(15,23,42,0.75)]"
					>
						<svg
							width="12"
							height="12"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<title>Chevron Down</title>
							<polyline points="6 9 12 15 18 9" />
						</svg>
					</span>
				</button>

				<button
					type="button"
					className="inline-flex items-center justify-center w-[42px] h-[42px] text-[rgba(255,255,255,0.85)] cursor-pointer bg-[rgba(4,9,20,0.75)] border border-[rgba(120,160,220,0.16)] rounded-[10px] transition-all duration-200 ease hover:text-white hover:bg-[rgba(4,9,20,0.9)] hover:border-[rgba(56,189,248,0.35)] [[data-theme='light']_&]:text-[#0f172a] [[data-theme='light']_&]:bg-[rgba(255,255,255,0.9)] [[data-theme='light']_&]:border-[rgba(15,23,42,0.12)]"
					onClick={onToggleTheme}
					aria-label="Toggle theme"
				>
					{resolvedMode === "day" ? (
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<title>Moon</title>
							<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
						</svg>
					) : (
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<title>Sun</title>
							<circle cx="12" cy="12" r="5" />
							<line x1="12" y1="1" x2="12" y2="3" />
							<line x1="12" y1="21" x2="12" y2="23" />
							<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
							<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
							<line x1="1" y1="12" x2="3" y2="12" />
							<line x1="21" y1="12" x2="23" y2="12" />
							<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
							<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
						</svg>
					)}
				</button>
			</div>
		</header>
	)
}
