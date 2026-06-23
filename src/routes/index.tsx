import { createFileRoute } from "@tanstack/react-router"

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
		<div className="homepage min-h-screen overflow-x-hidden font-['Inter',_'Segoe_UI',_system-ui,_-apple-system,_sans-serif] text-[15px] antialiased leading-[1.6] text-[#e8eef8] bg-[#04070f]">
			<Navbar />
			<Hero />
			<WhyItMatters />
			<div className="w-[92vw] max-w-[1800px] mx-auto h-[1px] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08)_20%,rgba(255,255,255,0.08)_80%,transparent)]" />
			<Infrastructure />
			<div className="w-[92vw] max-w-[1800px] mx-auto h-[1px] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08)_20%,rgba(255,255,255,0.08)_80%,transparent)]" />
			<Simulation />
			<div className="w-[92vw] max-w-[1800px] mx-auto h-[1px] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08)_20%,rgba(255,255,255,0.08)_80%,transparent)]" />
			<Navigation />
			<div className="w-[92vw] max-w-[1800px] mx-auto h-[1px] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08)_20%,rgba(255,255,255,0.08)_80%,transparent)]" />
			<Contributors />
			<Footer />
		</div>
	)
}
