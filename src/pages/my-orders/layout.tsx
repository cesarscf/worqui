import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/my-orders")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <Outlet />
    </div>
  )
}
