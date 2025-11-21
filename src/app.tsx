import {
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router"

export const Route = createRootRoute({
  component: RootComponent,
})

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { routeTree } from "@/router-tree.gen"

const router = createRouter({ routeTree })

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

function RootComponent() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
      <Toaster richColors />
    </ThemeProvider>
  )
}
