import { memo, useMemo } from "react";
import { infrastructureLayers } from "../../config/layers";
import LayerToggle from "../ui/LayerToggle";
import MetricBar from "../ui/MetricBar";
import { REGIONS } from "@/data/regions";
import { useRegionStore } from "@/shared/store/region";

type CommandPanelProps = {
  activeLayers: Record<string, boolean>;
  onToggleLayer: (id: string) => void;
};

function CommandPanel({ activeLayers, onToggleLayer }: CommandPanelProps) {
  const selectRegion = useRegionStore((state) => state.selectRegion);
  const activeRegionId = useRegionStore((state) => state.activeRegionId);

  const blockOptions = useMemo(
    () => REGIONS.filter((r) => r.level === "block" && r.parentId === "darbhanga"),
    [],
  );

  const activeRegionName = activeRegionId
    ? blockOptions.find((r) => r.id === activeRegionId)?.name.en ?? ""
    : "";

  return (
    <aside
      className="command-panel panel-surface"
      aria-label={activeRegionName ? `${activeRegionName} intelligence` : "Region intelligence"}
    >
      <header className="command-panel__header">
        <div className="command-panel__meta">
          <label className="sr-only" htmlFor="region-select">Select region</label>
          <select
            id="region-select"
            className="panel-select"
            value={activeRegionId ?? ""}
            onChange={(e) => selectRegion(e.target.value)}
          >
            <option value="" disabled>
              Select region
            </option>
            {blockOptions.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name.en}
              </option>
            ))}
          </select>
        </div>
        <div className="command-panel__meta">Region: {activeRegionId ?? "None"}</div>
      </header>

      <div className="command-panel__layers" role="list">
        {infrastructureLayers.map((layer) => (
          <LayerToggle
            key={layer.id}
            layer={layer}
            isActive={!!activeLayers[layer.id]}
            onToggle={onToggleLayer}
          />
        ))}
      </div>

      <div className="command-panel__scores">
        <p className="panel-kicker">Infrastructure Scores</p>
        <div className="command-panel__metrics">
          {infrastructureLayers.map((layer) => (
            <MetricBar
              key={layer.id}
              label={layer.scoreLabel}
              value={layer.score}
              color={layer.color}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}

export default memo(CommandPanel);
