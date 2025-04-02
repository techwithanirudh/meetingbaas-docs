import { cn } from '@/lib/cn';
import { BotIcon, CaptionsIcon, WebhookIcon } from 'lucide-react';
import type { LinkProps } from 'next/link';
import Link from 'next/link';

export default function DocsPage(): React.ReactElement {
  return (
    <main className="container flex flex-col py-16">
      <h1 className="text-2xl font-semibold md:text-3xl">
        Welcome to Meeting BaaS Documentation
      </h1>
      <p className="text-fd-muted-foreground mt-1 text-lg">
        Meeting Bots as a Service - Deploy AI bots to your video meetings
        through a unified API.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-4 text-left md:grid-cols-2">
        <Item href="/docs/api">
          <Icon>
            <WebhookIcon className="size-full" />
          </Icon>
          <h2 className="mb-2 text-lg font-semibold">Meeting BaaS API</h2>
          <p className="text-fd-muted-foreground text-sm">
            Send AI bots to Zoom, Teams, and Google Meet meetings using a no
            frills API.
          </p>
        </Item>

        <Item href="/docs/transcript-seeker">
          <Icon>
            <CaptionsIcon className="size-full" />
          </Icon>
          <h2 className="mb-2 text-lg font-semibold">Transcript Seeker</h2>
          <p className="text-fd-muted-foreground text-sm">
            Open-source transcription playground. Powered by transcription APIs,
            Meeting BaaS, and LLMs to chat with your transcripts.
          </p>
        </Item>
        <Item href="/docs/speaking-bots">
          <Icon>
            <BotIcon className="size-full" />
          </Icon>
          <h2 className="mb-2 text-lg font-semibold">Speaking Bots</h2>
          <p className="text-fd-muted-foreground text-sm">
            Speaking Bots for Google Meet, Microsoft Teams and Zoom. Powered by
            Pipecat and Meeting BaaS.
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
        'shadow-fd-primary/30 mb-2 size-9 rounded-lg border p-1.5',
        className,
      )}
      style={{
        boxShadow: 'inset 0px 8px 8px 0px var(--tw-shadow-color)',
      }}
    >
      {children}
    </div>
  );
}

function Item(
  props: LinkProps & { className?: string; children: React.ReactNode },
): React.ReactElement {
  return (
    <Link
      {...props}
      className={cn(
        'border-border hover:bg-fd-accent bg-fd-accent/30 rounded-lg border p-6 shadow-xs transition-all',
        props.className,
      )}
    >
      {props.children}
    </Link>
  );
}
