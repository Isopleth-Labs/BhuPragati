import { createFileRoute, useNavigate } from "@tanstack/react-router";
import StateMapShell from "@/modules/state/StateMapShell";

export const Route = createFileRoute("/state-map")({
  component: StateMapPage,
});

function StateMapPage() {
  const navigate = useNavigate();

  const handleBiharDrillDown = () => {
    navigate({ to: "/map" });
  };

  return <StateMapShell onBiharDrillDown={handleBiharDrillDown} />;
}
