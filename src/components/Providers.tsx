"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function Providers({ children }: React.PropsWithChildren) {
  const [client] = React.useState(new QueryClient());
  const pathname = usePathname();

  React.useEffect(() => {
    if (pathname !== "/sketch/create") {
      localStorage.clear();
    }
  }, [pathname]);

  return (
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default Providers;
