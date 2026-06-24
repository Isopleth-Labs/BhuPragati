export default function FilterPanel() {
	return (
		<div className="grid gap-1.5">
			{/* Search bar */}
			<div className="relative box-border flex items-center w-full h-[44px] px-[14px] bg-[rgba(7,24,50,0.9)] border border-[rgba(120,160,220,0.12)] rounded-[10px] transition-all duration-[160ms] ease-in-out focus-within:border-[rgba(100,150,255,0.35)] focus-within:shadow-[0_0_12px_rgba(100,150,255,0.08)]">
				<input
					className="w-full p-0 font-['Plus_Jakarta_Sans',Inter,sans-serif] text-[14px] font-normal text-white bg-transparent border-none focus:outline-none focus-visible:outline-none placeholder:text-[rgba(255,255,255,0.65)] placeholder:font-normal"
					placeholder="Search state..."
					aria-label="Search state"
				/>
				<span
					className="grid shrink-0 place-content-center place-items-center ml-[6px] text-[0.74rem] text-[rgba(255,255,255,0.85)]"
					aria-hidden
				>
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<title>Search</title>
						<circle
							cx="11"
							cy="11"
							r="7"
							stroke="currentColor"
							strokeWidth="1.5"
						/>
						<path
							d="m16.5 16.5 4 4"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
						/>
					</svg>
				</span>
			</div>

			{/* Filter rows */}
			<div className="grid grid-cols-1 gap-1.5">
				<label className="grid grid-cols-2 gap-2 items-center font-['Plus_Jakarta_Sans',Inter,sans-serif] text-[14px] font-medium text-[rgba(255,255,255,0.9)]">
					<span className="whitespace-nowrap">Filter by Population</span>
					<select
						defaultValue="all"
						className="w-full h-[42px] pt-0 pb-0 pr-[28px] pl-[14px] m-0 font-['Plus_Jakarta_Sans',_Inter,_sans-serif] text-[14px] font-medium text-[rgba(255,255,255,0.92)] appearance-none cursor-pointer bg-[rgba(6,26,56,0.95)] bg-[url('data:image/svg+xml,%3Csvg_xmlns=%22http://www.w3.org/2000/svg%22_width=%2210%22_height=%226%22_fill=%22none%22%3E%3Cpath_d=%22M1_1l4_4_4-4%22_stroke=%22rgba(255,255,255,0.6)%22_stroke-width=%221.4%22_stroke-linecap=%22round%22_stroke-linejoin=%22round%22/%3E%3C/svg%3E')] bg-no-repeat bg-[position:calc(100%_-_14px)_center] bg-[size:10px_6px] border border-[rgba(120,160,220,0.12)] rounded-[10px] shadow-none transition-all duration-[160ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-[rgba(100,150,255,0.25)] hover:shadow-[0_0_10px_rgba(100,150,255,0.08)] focus:outline-none focus:border-[rgba(100,150,255,0.35)] focus:shadow-[0_0_12px_rgba(100,150,255,0.12)]"
					>
						<option value="all">All</option>
						<option value=">50m">&gt; 50M</option>
						<option value="<50m">&lt; 50M</option>
					</select>
				</label>
				<label className="grid grid-cols-2 gap-2 items-center font-['Plus_Jakarta_Sans',Inter,sans-serif] text-[14px] font-medium text-[rgba(255,255,255,0.9)]">
					<span className="whitespace-nowrap">Filter by Region</span>
					<select
						defaultValue="all"
						className="w-full h-[42px] pt-0 pb-0 pr-[28px] pl-[14px] m-0 font-['Plus_Jakarta_Sans',_Inter,_sans-serif] text-[14px] font-medium text-[rgba(255,255,255,0.92)] appearance-none cursor-pointer bg-[rgba(6,26,56,0.95)] bg-[url('data:image/svg+xml,%3Csvg_xmlns=%22http://www.w3.org/2000/svg%22_width=%2210%22_height=%226%22_fill=%22none%22%3E%3Cpath_d=%22M1_1l4_4_4-4%22_stroke=%22rgba(255,255,255,0.6)%22_stroke-width=%221.4%22_stroke-linecap=%22round%22_stroke-linejoin=%22round%22/%3E%3C/svg%3E')] bg-no-repeat bg-[position:calc(100%_-_14px)_center] bg-[size:10px_6px] border border-[rgba(120,160,220,0.12)] rounded-[10px] shadow-none transition-all duration-[160ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-[rgba(100,150,255,0.25)] hover:shadow-[0_0_10px_rgba(100,150,255,0.08)] focus:outline-none focus:border-[rgba(100,150,255,0.35)] focus:shadow-[0_0_12px_rgba(100,150,255,0.12)]"
					>
						<option value="all">All</option>
						<option value="north">North</option>
						<option value="south">South</option>
						<option value="east">East</option>
						<option value="west">West</option>
					</select>
				</label>
				<label className="grid grid-cols-2 gap-2 items-center font-['Plus_Jakarta_Sans',Inter,sans-serif] text-[14px] font-medium text-[rgba(255,255,255,0.9)]">
					<span className="whitespace-nowrap">Sort by</span>
					<select
						defaultValue="overall"
						className="w-full h-[42px] pt-0 pb-0 pr-[28px] pl-[14px] m-0 font-['Plus_Jakarta_Sans',_Inter,_sans-serif] text-[14px] font-medium text-[rgba(255,255,255,0.92)] appearance-none cursor-pointer bg-[rgba(6,26,56,0.95)] bg-[url('data:image/svg+xml,%3Csvg_xmlns=%22http://www.w3.org/2000/svg%22_width=%2210%22_height=%226%22_fill=%22none%22%3E%3Cpath_d=%22M1_1l4_4_4-4%22_stroke=%22rgba(255,255,255,0.6)%22_stroke-width=%221.4%22_stroke-linecap=%22round%22_stroke-linejoin=%22round%22/%3E%3C/svg%3E')] bg-no-repeat bg-[position:calc(100%_-_14px)_center] bg-[size:10px_6px] border border-[rgba(120,160,220,0.12)] rounded-[10px] shadow-none transition-all duration-[160ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-[rgba(100,150,255,0.25)] hover:shadow-[0_0_10px_rgba(100,150,255,0.08)] focus:outline-none focus:border-[rgba(100,150,255,0.35)] focus:shadow-[0_0_12px_rgba(100,150,255,0.12)]"
					>
						<option value="overall">Overall Index</option>
						<option value="population">Population</option>
					</select>
				</label>
			</div>
		</div>
	)
}
