import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6">
        <ThemeToggle />
        <h1 className="text-4xl font-bold">Worqui</h1>
        <p className="text-muted-foreground">
          Sistema de autenticação com Better Auth + Elysia
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Fazer Login
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 border border-input rounded-md hover:bg-accent"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
