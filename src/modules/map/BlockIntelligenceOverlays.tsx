import { useState } from "react";
import { FeaturePopupController } from "./controllers/FeaturePopupController";
import { FocusPulseController } from "./controllers/FocusPulseController";
import { IntelligenceSoftenController } from "./controllers/IntelligenceSoftenController";
import { AdministrativeBoundaryLayer } from "./layers/AdministrativeBoundaryLayer";
import { CommandCenterLayer } from "./layers/CommandCenterLayer";
import { InfrastructureLayer } from "./layers/InfrastructureLayer";
import { OsmOverlayLayer } from "./layers/OsmOverlayLayer";

interface BlockIntelligenceOverlaysProps {
	activeLayers: Record<string, boolean>;
}

// Block-scale (Kusheshwar Asthan) overlay bundle — focus rings, command
// center pulse, the 9 infrastructure modules, and their popups/animation.
// Rendered as MapEngine's {children} only when the active region is
// block-level; omitted entirely for state-level views (e.g. Bihar), so
// none of these layers mount or fetch in that mode.
export function BlockIntelligenceOverlays({
	activeLayers,
}: BlockIntelligenceOverlaysProps) {
	const [infraReady, setInfraReady] = useState(false);
	const [adminReady, setAdminReady] = useState(false);

	return (
		<>
			<OsmOverlayLayer />
			<AdministrativeBoundaryLayer onReady={() => setAdminReady(true)} />
			<CommandCenterLayer />
			<InfrastructureLayer
				activeLayers={activeLayers}
				onReady={() => setInfraReady(true)}
			/>
			<IntelligenceSoftenController ready={infraReady} />
			<FocusPulseController ready={infraReady} />
			<FeaturePopupController ready={infraReady && adminReady} />
		</>
	);
}
