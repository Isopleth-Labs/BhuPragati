import { memo } from "react";
import {
	operationalStats,
	dashboardMeta,
} from "@/shared/lib/metadata/metadata";

// Premium top HUD: compact metadata mini-cards + brand card.
function TopBar() {
	return (
		<header className="top-bar">
			<dl className="top-bar__meta">
				{operationalStats.map((stat) => (
					<div key={stat.label} className="meta-card panel-surface">
						<dt>{stat.label}</dt>
						<dd>{stat.value}</dd>
					</div>
				))}
			</dl>

			<div className="brand-card panel-surface">
				<span className="brand-card__pulse" aria-hidden="true" />
				<div>
					<p className="brand-card__kicker">{dashboardMeta.kicker}</p>
					<h1>{dashboardMeta.title}</h1>
				</div>
			</div>
		</header>
	);
}

export default memo(TopBar);
