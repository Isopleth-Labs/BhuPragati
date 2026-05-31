import { memo } from "react";

// Reusable neon HUD panel. Wraps the shared `panel-surface` styling
// so individual panels stay focused on their own structure.

function NeonPanel({
  as: Tag = "section",
  className = "",
  children,
  ariaLabel,
  ...rest
}) {
  const composed = `panel-surface ${className}`.trim();
  return (
    <Tag className={composed} aria-label={ariaLabel} {...rest}>
      {children}
    </Tag>
  );
}

export default memo(NeonPanel);
