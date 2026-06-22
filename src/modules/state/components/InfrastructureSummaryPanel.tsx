export default function InfrastructureSummaryPanel() {
	return (
		<div className="state-infra-summary">
			<div className="state-infra-summary__header">
				<h3 className="state-infra-summary__title">INFRASTRUCTURE SUMMARY</h3>
				<p className="state-infra-summary__sub">
					Snapshot of national infrastructure
				</p>
			</div>
			<div className="state-infra-summary__grid">
				<div className="state-infra-summary__col">
					<div className="state-infra-summary__row-top">
						<span className="state-infra-summary__icon" aria-hidden>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<title>Ports</title>
								<circle
									cx="12"
									cy="5"
									r="3"
									fill="currentColor"
									fillOpacity="0.15"
								/>
								<line x1="12" y1="8" x2="12" y2="20" />
								<path d="M5 12h14" />
								<path d="M12 20a6 6 0 0 1-6-6M12 20a6 6 0 0 0 6-6" />
							</svg>
						</span>
						<span className="state-infra-summary__label">Ports</span>
					</div>
					<span className="state-infra-summary__value">13</span>
				</div>
				<span className="state-infra-summary__divider" aria-hidden />

				<div className="state-infra-summary__col">
					<div className="state-infra-summary__row-top">
						<span className="state-infra-summary__icon" aria-hidden>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<title>Corridors</title>
								<path
									d="M2 20V10l5 3V10l5 3V10l10 4v6z"
									fill="currentColor"
									fillOpacity="0.15"
								/>
								<path d="M17 18h1" />
								<path d="M12 18h1" />
								<path d="M7 18h1" />
							</svg>
						</span>
						<span className="state-infra-summary__label">Corridors</span>
					</div>
					<span className="state-infra-summary__value">11</span>
				</div>
				<span className="state-infra-summary__divider" aria-hidden />

				<div className="state-infra-summary__col">
					<div className="state-infra-summary__row-top">
						<span className="state-infra-summary__icon" aria-hidden>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<title>Smart Cities</title>
								<rect
									x="2"
									y="10"
									width="8"
									height="10"
									rx="1"
									fill="currentColor"
									fillOpacity="0.15"
								/>
								<rect
									x="14"
									y="4"
									width="8"
									height="16"
									rx="1"
									fill="currentColor"
									fillOpacity="0.15"
								/>
								<rect
									x="8"
									y="12"
									width="6"
									height="8"
									rx="1"
									fill="currentColor"
									fillOpacity="0.15"
								/>
							</svg>
						</span>
						<span className="state-infra-summary__label">Smart Cities</span>
					</div>
					<span className="state-infra-summary__value">100</span>
				</div>
				<span className="state-infra-summary__divider" aria-hidden />

				<div className="state-infra-summary__col">
					<div className="state-infra-summary__row-top">
						<span className="state-infra-summary__icon" aria-hidden>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<title>Water Supply</title>
								<path
									d="M12 22a7 7 0 0 0 7-7c0-4.3-7-13-7-13S5 10.7 5 15a7 7 0 0 0 7 7z"
									fill="currentColor"
									fillOpacity="0.18"
								/>
							</svg>
						</span>
						<span className="state-infra-summary__label">Water Supply</span>
					</div>
					<span className="state-infra-summary__value">91.6%</span>
				</div>
			</div>
		</div>
	)
}
