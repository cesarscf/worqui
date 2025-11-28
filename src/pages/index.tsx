import { createFileRoute } from "@tanstack/react-router"
import { ServiceOrderForm } from "@/components/service-order-form"

export const Route = createFileRoute("/")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="container mx-auto p-4">
      <ServiceOrderForm className="max-w-md mx-auto" />
    </div>
  )
}
