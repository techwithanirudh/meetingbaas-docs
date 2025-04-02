'use client';
import { type ButtonHTMLAttributes, useState } from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/cn';
import { buttonVariants } from '@/components/ui/button';

// lazy load the dialog
const SearchAI = dynamic(() => import('./search'), { ssr: false });

/**
 * The trigger component for AI search dialog.
 *
 * Use it like a normal button component.
 */
export function AISearchTrigger(
  props: ButtonHTMLAttributes<HTMLButtonElement>,
) {
  const [open, setOpen] = useState<boolean>();

  return (
    <>
      {open !== undefined ? (
        <SearchAI open={open} onOpenChange={setOpen} />
      ) : null}
      <button
        {...props}
        onClick={() => setOpen(true)}
        className={cn(
          buttonVariants({
            variant: 'default',
          }),
          'bg-fd-primary text-fd-primary-foreground fixed right-4 bottom-4 z-10 gap-2 rounded-xl shadow-lg backdrop-blur-lg md:right-8 md:bottom-8',
          props.className,
        )}
      />
    </>
  );
}
