import "./homepage.css"
import Contributors from "./components/Contributors"
import Footer from "./components/Footer"
import Hero from "./components/Hero"
import Infrastructure from "./components/Infrastructure"
import Navbar from "./components/Navbar"
import Navigation from "./components/Navigation"
import Simulation from "./components/Simulation"
import WhyItMatters from "./components/WhyItMatters"

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
	)
}
