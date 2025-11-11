import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function AuthLayout({
  children,
}: React.PropsWithChildren) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/w");
  }

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
