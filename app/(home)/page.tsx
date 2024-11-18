import { Building2, CloudIcon, LibraryIcon, MicVocalIcon, WebhookIcon } from "lucide-react";
import Link from "next/link";
import type { LinkProps } from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export default function DocsPage(): React.ReactElement {
    return (
        // todo: don't use px use tailwidn spacing
        <main className="container flex flex-col justify-center items-center text-center h-[calc(100svh_-_54px_-_73px)]">
            <h1 className="mb-4 text-4xl font-semibold md:text-5xl">
                Getting Started
            </h1>
            <p className="text-fd-muted-foreground">
                Choose which documentation you would like to explore.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-4 text-left md:grid-cols-2">
                <Item href="/docs/api">
                    <Icon>
                        <WebhookIcon className="size-full" />
                    </Icon>
                    <h2 className="mb-2 text-lg font-semibold">
                        MeetingBaas API
                    </h2>
                    <p className="text-sm">Learn how to use the MeetingBaas API</p>
                </Item>
                <Item href="/docs/speaking-bots">
                    <Icon>
                        <MicVocalIcon className="size-full" />
                    </Icon>
                    <h2 className="mb-2 text-lg font-semibold">
                        Speaking Bots
                    </h2>
                    <p className="text-sm">Pipecat-powered Speaking Bots</p>
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
                className,
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
    props: LinkProps & { className?: string; children: React.ReactNode },
): React.ReactElement {
    return (
        <Link
            {...props}
            className={cn(
                "rounded-2xl border border-border p-6 shadow-sm transition-all hover:bg-fd-accent",
                props.className,
            )}
        >
            {props.children}
        </Link>
    );
}
