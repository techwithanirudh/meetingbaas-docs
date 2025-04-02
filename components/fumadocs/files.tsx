'use client';

import { cva } from 'class-variance-authority';
import { FileIcon, FolderIcon, FolderOpen } from 'lucide-react';
import { useState, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/fumadocs/cn';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';

const itemVariants = cva(
  'flex flex-row items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-fd-accent hover:text-fd-accent-foreground [&_svg]:size-4',
);

export function Files({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return (
    <div
      className={cn('not-prose bg-fd-card rounded-md border p-2', className)}
      {...props}
    >
      {props.children}
    </div>
  );
}

export interface FileProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  icon?: ReactNode;
  description?: string;
}

export interface FolderProps extends HTMLAttributes<HTMLDivElement> {
  name: string;

  disabled?: boolean;
  description?: string;

  /**
   * Open folder by default
   *
   * @defaultValue false
   */
  defaultOpen?: boolean;
}

export function File({
  name,
  icon = <FileIcon />,
  description,
  className,
  ...rest
}: FileProps): React.ReactElement {
  return (
    <div className={cn(itemVariants({ className }))} {...rest}>
      <div className="flex flex-row items-center gap-2">
        {icon}
        {name}
      </div>
      {description && (
        <div className="text-fd-primary/80 text-xs">{description}</div>
      )}
    </div>
  );
}

export function Folder({
  name,
  defaultOpen = false,
  description,
  ...props
}: FolderProps): React.ReactElement {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible open={open} onOpenChange={setOpen} {...props}>
      <CollapsibleTrigger className={cn(itemVariants({ className: 'w-full' }))}>
        <div className="flex flex-row items-center gap-2">
          {open ? <FolderOpen /> : <FolderIcon />}
          {name}
        </div>
        {description && (
          <div className="text-fd-primary/80 text-xs">{description}</div>
        )}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="ms-2 flex flex-col border-l ps-2">{props.children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}
