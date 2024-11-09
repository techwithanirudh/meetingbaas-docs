"use client";
import { RootProvider } from "fumadocs-ui/provider";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { NuqsAdapter } from 'nuqs/adapters/next/app'

const SearchDialog = dynamic(() => import("@/components/search")); // lazy load

export function Providers({ children }: { children: ReactNode }) {
  return (
    <NuqsAdapter>
      <RootProvider
        search={{
          SearchDialog,
        }}
        theme={{
          enabled: true,
        }}
      >
        {children}
      </RootProvider>
    </NuqsAdapter>
  );
}
