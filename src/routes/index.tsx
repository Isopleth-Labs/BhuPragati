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

const Divider = () => (
	<div className="mx-auto h-px w-full max-w-[min(1800px,92vw)] bg-white/[0.08] opacity-80" />
)

export default function Homepage() {
	return (
		<div className="min-h-screen overflow-x-hidden text-base leading-relaxed antialiased font-[Inter,_Segoe_UI,_system-ui,_-apple-system,_sans-serif] text-[#e8eef8] bg-[#04070f]">
			<Navbar />
			<Hero />
			<WhyItMatters />
			<Divider />
			<Infrastructure />
			<Divider />
			<Simulation />
			<Divider />
			<Navigation />
			<Divider />
			<Contributors />
			<Footer />
		</div>
	)
}