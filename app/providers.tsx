"use client";
import { RootProvider } from "fumadocs-ui/provider";
import dynamic from "next/dynamic";
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import type { ReactNode } from "react";

const SearchDialog = dynamic(() => import("@/components/search")); // lazy load

export function Providers({ children }: { children: ReactNode }) {
  return (
    <NuqsAdapter>
      <RootProvider
        search={{
          SearchDialog,
        }}
        theme={{
          enabled: false,
          enableSystem: false,
          forcedTheme: 'dark'
        }}
      >
        {children}
      </RootProvider>
    </NuqsAdapter>
  );
}
