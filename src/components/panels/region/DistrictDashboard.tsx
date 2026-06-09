import { memo, useMemo } from "react";
import { getRegion, getChildren } from "@/data/regions";
import { useRegionStore } from "@/shared/store/region";
import ExplorerList from "./ExplorerList";

const DISTRICT_METRICS: Record<string, { population: string; blocks: number; roadLength: string; hospitals: number; schools: number }> = {
  darbhanga: {
    population: "4.0M",
    blocks: 18,
    roadLength: "2,450 km",
    hospitals: 42,
    schools: 1310,
  },
};

function DistrictDashboard() {
  const selectRegion = useRegionStore((s) => s.selectRegion);
  const activeRegionId = useRegionStore((s) => s.activeRegionId);

  const { metrics, blocks } = useMemo(() => {
    const metrics = activeRegionId ? DISTRICT_METRICS[activeRegionId] : undefined;
    const blocks = activeRegionId ? getChildren(activeRegionId).filter((r) => r.level === "block") : [];
    return { metrics, blocks };
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
          <span className="stat__label">Blocks</span>
          <span className="stat__value">{metrics?.blocks ?? "—"}</span>
        </div>
        <div className="stat">
          <span className="stat__label">Road Length</span>
          <span className="stat__value">{metrics?.roadLength ?? "—"}</span>
        </div>
        <div className="stat">
          <span className="stat__label">Hospitals</span>
          <span className="stat__value">{metrics?.hospitals ?? "—"}</span>
        </div>
        <div className="stat">
          <span className="stat__label">Schools</span>
          <span className="stat__value">{metrics?.schools ?? "—"}
          </span>
        </div>
      </div>

      <ExplorerList
        title="Block Explorer"
        items={blocks.map((b) => ({ id: b.id, title: b.name.en }))}
        onSelect={(id) => selectRegion(id)}
      />
    </section>
  );
}

export default memo(DistrictDashboard);
