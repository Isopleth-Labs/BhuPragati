import { memo, useMemo } from "react";
import { dashboardMeta } from "../../config/metadata";
import { getAncestorChain, getRegion } from "@/data/regions";
import { useRegionStore } from "@/shared/store/region";

// Premium top HUD: compact metadata mini-cards + brand card.
function TopBar() {
  const activeRegionId = useRegionStore((state) => state.activeRegionId);

  const { commandZone, districtName, pinValue } = useMemo(() => {
    const region = activeRegionId ? getRegion(activeRegionId) : undefined;
    const ancestors = activeRegionId ? getAncestorChain(activeRegionId) : [];
    const district = ancestors.find((r) => r.level === "district");

    return {
      commandZone: region?.name.en ?? "Select a region",
      districtName: district?.name.en ?? "—",
      pinValue: region?.pinCodes[0] ?? "—",
    };
  }, [activeRegionId]);

  if (!activeRegionId) return null;

  const stats = useMemo(
    () => [
      { label: "Command Zone", value: commandZone },
      { label: "District", value: districtName },
      { label: "PIN", value: pinValue },
      { label: "Mode", value: "Live GIS" },
    ],
    [commandZone, districtName, pinValue],
  );

  return (
    <header className="top-bar" aria-label="Operational context">
      <dl className="top-bar__meta">
        {stats.map((stat) => (
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
