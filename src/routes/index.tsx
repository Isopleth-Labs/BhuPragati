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

const Divider = () => (
	<div
		aria-hidden="true"
		className="w-full max-w-[min(1800px,92vw)] h-px mx-auto bg-[rgba(255,255,255,0.08)] opacity-80"
	/>
)

export default function Homepage() {
	return (
		<div className="min-h-screen overflow-x-hidden [font-family:Inter,Segoe_UI,system-ui,-apple-system,sans-serif] text-[15px] leading-[1.6] bg-[#04070f] text-[#e8eef8]">
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
