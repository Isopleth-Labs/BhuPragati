import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/$state/$district/")({
	component: RouteComponent,
})

function RouteComponent() {
	return <div>Hello "/$state/$district/"!</div>
}
