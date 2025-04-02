import type { LucideIcon } from 'lucide-react';
import { TerminalIcon } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export function IconContainer({
  icon: Icon,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  icon?: LucideIcon;
}): React.ReactElement {
  return (
    <div
      {...props}
      className={cn(
        'from-muted to-secondary [a[data-active=true]_&]:from-primary/60 [a[data-active=true]_&]:to-primary [a[data-active=true]_&]:text-primary-foreground rounded-md border bg-linear-to-b p-0.5 shadow-md',
        props.className,
      )}
    >
      {Icon ? <Icon /> : <TerminalIcon />}
    </div>
  );
}
