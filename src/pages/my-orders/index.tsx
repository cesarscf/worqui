import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/my-orders/")({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/p/"!</div>
}
