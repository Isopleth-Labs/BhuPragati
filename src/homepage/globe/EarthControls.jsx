import { useEffect } from 'react';

function EarthControls({ engine }) {
  useEffect(() => {
    if (!engine?.addRenderCallback || !engine?.earthRoot) return undefined;

    const stop = engine.addRenderCallback(() => {
      engine.earthRoot.rotation.y += 0.00035;
    });

    return () => {
      stop?.();
    };
  }, [engine]);

  return null;
}

export default EarthControls;
