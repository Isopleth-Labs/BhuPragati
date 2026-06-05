import DashboardShell from "./components/DashboardShell";
import Homepage from "./homepage/Homepage";
import StandaloneEarth from "./homepage/globe/StandaloneEarth";

const SHOW_EARTH_PROTOTYPE = true;
const SHOW_HOMEPAGE = true;

function App() {
  if (SHOW_EARTH_PROTOTYPE) {
    return <StandaloneEarth />;
  }
  return SHOW_HOMEPAGE ? <Homepage /> : <DashboardShell />;
}

export default App;
