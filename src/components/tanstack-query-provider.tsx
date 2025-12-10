"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

export function TanstackQueryProvider({ children }: React.PropsWithChildren) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
