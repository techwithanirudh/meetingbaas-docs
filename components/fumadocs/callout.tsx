import { AlertTriangle, CircleX, Info } from "lucide-react";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/fumadocs/cn";

type CalloutProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "title" | "type" | "icon"
> & {
  title?: ReactNode;
  /**
   * @defaultValue info
   */
  type?: "info" | "warn" | "error";

  /**
   * Force an icon
   */
  icon?: ReactNode;
};

export const Callout = forwardRef<HTMLDivElement, CalloutProps>(
  ({ className, children, title, type = "info", icon, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "my-6 flex flex-row gap-2 rounded-lg border bg-fd-card p-3 text-sm text-fd-card-foreground shadow-md",
          className
        )}
        {...props}
      >
        {icon ??
          {
            // todo
            info: <Info className="h-5 w-5 text=yellow" />,
            warn: <AlertTriangle className="h-5 w-5 text-callout-warn" />,
            error: <CircleX className="h-5 w-5 text-callout-error" />,
          }[type]}
        <div className="min-w-0 flex-1">
          {title ? <p className="not-prose mb-2 font-medium">{title}</p> : null}
          <div className="text-fd-muted-foreground prose-no-margin">
            {children}
          </div>
        </div>
      </div>
    );
  }
);

Callout.displayName = "Callout";
