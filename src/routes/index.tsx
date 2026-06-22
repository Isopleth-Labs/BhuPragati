import { createFileRoute } from "@tanstack/react-router"
import "@/shared/styles/homepage.css"
import Contributors from "@/shared/components/homepage/Contributors"
import Footer from "@/shared/components/homepage/Footer"
import Hero from "@/shared/components/homepage/Hero"
import Infrastructure from "@/shared/components/homepage/Infrastructure"
import Navbar from "@/shared/components/homepage/Navbar"
import Navigation from "@/shared/components/homepage/Navigation"
import Simulation from "@/shared/components/homepage/Simulation"
import WhyItMatters from "@/shared/components/homepage/WhyItMatters"

export const Route = createFileRoute("/")({ component: Homepage })

function Homepage() {
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
