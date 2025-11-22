import { createFileRoute } from "@tanstack/react-router"
import { NavUser } from "@/components/nav-user"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <Button>Entrar</Button>
      <NavUser
        user={{
          avatar: "",
          email: "",
          name: "",
        }}
      />
    </div>
  )
}
