import "./homepage.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WhyItMatters from "./components/WhyItMatters";
import Infrastructure from "./components/Infrastructure";
import Simulation from "./components/Simulation";
import Navigation from "./components/Navigation";
import Contributors from "./components/Contributors";
import Footer from "./components/Footer";

export default function Homepage() {
  return (
    <div className="homepage">
      <Navbar />
      <Hero />
      <WhyItMatters />
      <div className="homepage__divider" />
      <Infrastructure />
      <div className="homepage__divider" />
      <Simulation />
      <div className="homepage__divider" />
      <Navigation />
      <div className="homepage__divider" />
      <Contributors />
      <Footer />
    </div>
  );
}
