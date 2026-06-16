import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/gis')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/gis"!</div>
}
