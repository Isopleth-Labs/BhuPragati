import { memo, useMemo } from "react";
import { getRegion, getChildren } from "@/data/regions";
import { useRegionStore } from "@/shared/store/region";
import ExplorerList from "./ExplorerList";

const STATE_METRICS = {
  bihar: {
    population: "128M",
    districts: 38,
    blocks: 534,
    villages: 45000,
    area: "94,163 km²",
  },
};

function StateDashboard() {
  const selectRegion = useRegionStore((s) => s.selectRegion);
  const activeRegionId = useRegionStore((s) => s.activeRegionId);

  const { metrics, districts } = useMemo(() => {
    const metrics = activeRegionId && (activeRegionId in STATE_METRICS) ? STATE_METRICS[activeRegionId as keyof typeof STATE_METRICS] : undefined;
    const districts = activeRegionId ? getChildren(activeRegionId).filter((r) => r.level === "district") : [];
    return { metrics, districts };
  }, [activeRegionId]);

  if (!activeRegionId) return null;

  const region = getRegion(activeRegionId);
  if (!region) return null;

  return (
    <section className="panel-surface region-dashboard" aria-label={`${region.name.en} overview`}>
      <header className="region-dashboard__header">
        <p className="panel-kicker">{region.name.en} Overview</p>
      </header>

      <div className="region-dashboard__stats">
        <div className="stat">
          <span className="stat__label">Population</span>
          <span className="stat__value">{metrics?.population ?? "—"}</span>
        </div>
        <div className="stat">
          <span className="stat__label">Districts</span>
          <span className="stat__value">{metrics?.districts ?? "—"}</span>
        </div>
        <div className="stat">
          <span className="stat__label">Blocks</span>
          <span className="stat__value">{metrics?.blocks ?? "—"}</span>
        </div>
        <div className="stat">
          <span className="stat__label">Villages</span>
          <span className="stat__value">{metrics?.villages ?? "—"}</span>
        </div>
        <div className="stat">
          <span className="stat__label">Area</span>
          <span className="stat__value">{metrics?.area ?? "—"}</span>
        </div>
      </div>

      <ExplorerList
        title="District Explorer"
        items={districts.map((d) => ({ id: d.id, title: d.name.en }))}
        onSelect={(id) => selectRegion(id)}
      />
    </section>
  );
}

export default memo(StateDashboard);
