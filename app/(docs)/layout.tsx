import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { baseOptions } from "@/app/layout.config";
import { source } from "@/lib/source";
// import { Trigger } from '@/components/fumadocs/ai/search-ai';
// import { buttonVariants } from '@/components/ui/button';
// import { cn } from '@/lib/cn';
// import { MessageCircle } from 'lucide-react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout tree={source.pageTree} {...baseOptions}>
      {children}
      {/* <Trigger
        className={cn(
          buttonVariants({
            variant: 'secondary',
          }),
          'fixed bottom-0 left-1/2 h-fit -translate-x-1/2 gap-1.5 rounded-b-none rounded-t-2xl bg-secondary/50 pb-1 text-fd-muted-foreground shadow-lg backdrop-blur-lg',
        )}
      >
        <MessageCircle className="size-4" />
        Ask AI
      </Trigger> */}
    </DocsLayout>
  );
}
