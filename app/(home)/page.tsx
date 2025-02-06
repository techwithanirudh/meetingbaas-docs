import { cn } from "@/lib/cn";
import { BotIcon, CaptionsIcon, WebhookIcon } from "lucide-react";
import type { LinkProps } from "next/link";
import Link from "next/link";

export default function DocsPage(): React.ReactElement {
  return (
    <main className="container flex flex-col py-16">
      <h1 className="text-2xl font-semibold md:text-3xl">
        Welcome to MeetingBaas Docs
      </h1>
      <p className="text-fd-muted-foreground text-lg mt-1">
        Choose which documentation you would like to explore.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-4 text-left md:grid-cols-2">
        <Item href="/docs/api">
          <Icon>
            <WebhookIcon className="size-full" />
          </Icon>
          <h2 className="mb-2 text-lg font-semibold">MeetingBaas API</h2>
          <p className="text-sm text-fd-muted-foreground">
            MeetingBaas API reference and guides.
          </p>
        </Item>

        <Item href="/docs/transcript-seeker">
          <Icon>
            <CaptionsIcon className="size-full" />
          </Icon>
          <h2 className="mb-2 text-lg font-semibold">Transcript Seeker</h2>
          <p className="text-sm text-fd-muted-foreground">
            Open-source transcription playground. Powered by transcription APIs,
            MeetingBaas, and LLMs to chat with your transcripts.
          </p>
        </Item>
        <Item href="/docs/speaking-bots">
          <Icon>
            <BotIcon className="size-full" />
          </Icon>
          <h2 className="mb-2 text-lg font-semibold">Speaking Bots</h2>
          <p className="text-sm text-fd-muted-foreground">
            Speaking Bots for Google Meet, Microsoft Teams and Zoom. Powered by
            Pipecat and MeetingBaas.
          </p>
        </Item>
      </div>
    </main>
  );
}

function Icon({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div
      className={cn(
        "mb-2 size-9 rounded-lg border p-1.5 shadow-fd-primary/30",
        className
      )}
      style={{
        boxShadow: "inset 0px 8px 8px 0px var(--tw-shadow-color)",
      }}
    >
      {children}
    </div>
  );
}

function Item(
  props: LinkProps & { className?: string; children: React.ReactNode }
): React.ReactElement {
  return (
    <Link
      {...props}
      className={cn(
        "rounded-lg border border-border p-6 shadow-xs transition-all hover:bg-fd-accent  bg-fd-accent/30",
        props.className
      )}
    >
      {props.children}
    </Link>
  );
}
