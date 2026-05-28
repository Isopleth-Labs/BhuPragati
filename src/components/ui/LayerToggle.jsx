import { memo, useCallback } from "react";
import LayerIcon from "./LayerIcon";

// Tactical layer-toggle row. Compact, icon-led, used in the
// command panel layer list.

function LayerToggle({ layer, isActive, onToggle }) {
  const handleClick = useCallback(() => onToggle(layer.id), [layer.id, onToggle]);

  return (
    <button
      type="button"
      className="layer-toggle"
      style={{ "--layer-color": layer.color }}
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
