import "@/styles/globals.css";

import type { Metadata } from "next";
import { TanstackQueryProvider } from "@/components/tanstack-query-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { fontMono, fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Worqui",
  description:
    "Encontre profissionais confiáveis para resolver o seu problema.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "isolate min-h-screen font-sans antialiased",
          fontSans.variable,
          fontMono.variable,
        )}
      >
        <TanstackQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster richColors position="top-center" />
          </ThemeProvider>
        </TanstackQueryProvider>
      </body>
    </html>
  );
}
