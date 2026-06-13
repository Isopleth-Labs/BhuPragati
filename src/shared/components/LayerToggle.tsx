import type { CSSVars} from "@/shared/styles/types";
import { memo, useCallback } from "react";
import LayerIcon from "./LayerIcon";
import type { InfrastructureLayer } from "@/shared/types";

// Tactical layer-toggle row. Compact, icon-led, used in the
// command panel layer list.

type LayerToggleProps = {
  layer: InfrastructureLayer;
  isActive: boolean;
  onToggle: (id: string) => void;
};

function LayerToggle({ layer, isActive, onToggle }: LayerToggleProps) {
  const handleClick = useCallback(() => onToggle(layer.id), [layer.id, onToggle]);

  const style: CSSVars = { "--layer-color": layer.color  ?? "transparent"};

  return (
    <button
      type="button"
      className="layer-toggle"
      style={style}
      aria-pressed={isActive}
      onClick={handleClick}
      title={layer.summary}
    >
      <span className="layer-toggle__icon" aria-hidden="true">
        <LayerIcon iconKey={layer.iconKey} size={18} />
      </span>
      <span className="layer-toggle__label">{layer.intelligenceLabel}</span>
      <span className="layer-toggle__dot" aria-hidden="true" />
    </button>
  );
}

export default memo(LayerToggle);
