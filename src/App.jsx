import DashboardShell from "./components/DashboardShell";
import Homepage from "./homepage/Homepage";
import StandaloneEarth from "./homepage/globe/StandaloneEarth";
import GlobeViz from "./components/GlobeViz";

const SHOW_EARTH_PROTOTYPE = true;
const SHOW_HOMEPAGE = true;

function App() {
  if (SHOW_EARTH_PROTOTYPE) {
    return <GlobeViz />;
  }
  return SHOW_HOMEPAGE ? <Homepage /> : <DashboardShell />;
}

export default App;
