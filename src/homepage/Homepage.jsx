import "./homepage.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CapabilityStrip from "./components/CapabilityStrip";
import WhyItMatters from "./components/WhyItMatters";
import Infrastructure from "./components/Infrastructure";
import Simulation from "./components/Simulation";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";

export default function Homepage() {
  return (
    <div className="homepage">
      <Navbar />
      <Hero />
      <CapabilityStrip />
      <WhyItMatters />
      <Infrastructure />
      <Simulation />
      <Navigation />
      <section className="section section--placeholder">
        <div className="section__header">
          <p className="eyebrow">Contributors</p>
          <h2>Recognizing the people who build the platform</h2>
          <p className="section__lede">Contributor recognition and roles coming soon.</p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
