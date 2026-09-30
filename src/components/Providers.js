"use client";

import { SWRConfig } from "swr";
import { apiFetch } from "@/lib/api";

export default function Providers({ children }) {
  return (
    <SWRConfig
      value={{
        fetcher: (path) => apiFetch(path),
        revalidateOnFocus: false,
        revalidateIfStale: true,
        dedupingInterval: 15000,
        errorRetryCount: 2,
      }}
    >
      {children}
    </SWRConfig>
  );
}
