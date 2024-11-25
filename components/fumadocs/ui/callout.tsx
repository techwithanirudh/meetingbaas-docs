"use client";

import { cn } from "@/lib/fumadocs/cn";
import { InfoIcon } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";

interface CalloutProps extends HTMLAttributes<HTMLDivElement> {
  type?: "info" | "warning" | "error";
  children: ReactNode;
  border?: boolean;
}

export function Callout({
  children,
  type = "info",
  className,
  border = false,
  ...props
}: CalloutProps): React.ReactElement {
  return (
    <div
      className={cn(
        "my-4 flex items-baseline gap-2 rounded-lg bg-fd-card py-2 pl-2",
        border && [
          "border",
          type === "info" && "border-[#78FFF0]",
          type === "warning" && "border-[#FFFF93]",
          type === "error" && "border-red-500",
        ],
        type === "info" && "[&_svg]:text-[#78FFF0]",
        type === "warning" && "[&_svg]:text-[#FFFF93]",
        type === "error" && "[&_svg]:text-red-500",
        "[&>div>p+ul]:mt-2",
        className
      )}
      {...props}
    >
      <InfoIcon className="h-4 w-4 shrink-0 translate-y-[2px]" />
      <div className="flex-1 pr-0">{children}</div>
    </div>
  );
}
