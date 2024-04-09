"use client";

import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function Providers({ children }: React.PropsWithChildren) {
  const [client] = React.useState(new QueryClient());
  const SupabaseCtx = React.createContext({
    user: null,
  });

  return (
    <QueryClientProvider client={client}>
      {/* <SupabaseCtx.Provider value={{ user: user }}> */}
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      {/* </SupabaseCtx.Provider> */}
    </QueryClientProvider>
  );
}

export default Providers;
