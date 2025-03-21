'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { ScrollArea, ScrollViewport } from 'fumadocs-ui/components/ui/scroll-area';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Loader2, RotateCcw, Send } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { MessageRecord, useAI, useAIMessages } from './context';
import { Processor } from './markdown-processor';

let processor: Processor | undefined;
const map = new Map<string, ReactNode>();

function Markdown({ text }: { text: string }) {
    const [currentText, setCurrentText] = useState<string>();
    const [rendered, setRendered] = useState<ReactNode>(map.get(text));

    async function run() {
        const { createProcessor } = await import('./markdown-processor');

        processor ??= createProcessor();
        let result = map.get(text);

        if (!result) {
            result = await processor
                .process(text, {
                    ...defaultMdxComponents,
                    img: undefined,
                })
                .catch(() => text);
        }

        map.set(text, result);
        setRendered(result);
    }

    if (text !== currentText) {
        setCurrentText(text);
        void run();
    }

    return rendered ?? text;
}

function Message({ message }: { message: MessageRecord }) {
    console.log('Rendering message:', message);
    return (
        <div
            className={cn(
                'mb-4 w-full flex',
                message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
        >
            <div
                className={cn(
                    'max-w-[80%]',
                    message.role === 'user'
                        ? 'text-fd-primary'
                        : 'text-fd-foreground'
                )}
            >
                {message.role === 'user' && (
                    <div className="text-xs text-fd-muted-foreground mb-1 text-right">
                        You
                    </div>
                )}
                {message.role === 'assistant' && (
                    <div className="text-xs text-fd-muted-foreground mb-1">
                        AI
                    </div>
                )}
                <div className="leading-relaxed">
                    <Markdown text={message.content} />
                </div>
            </div>
            {message.references && message.references.length > 0 && (
                <div className="mt-2 flex flex-row flex-wrap items-center gap-1">
                    {message.references.map((ref, i) => (
                        <a
                            key={i}
                            href={ref.url}
                            className="block text-xs rounded-lg border p-3 hover:bg-fd-accent hover:text-fd-accent-foreground"
                        >
                            <p className="font-medium">{ref.title}</p>
                            <p className="text-fd-muted-foreground">
                                {ref.description ?? 'Reference'}
                            </p>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}

export function ChatInterface() {
    const { loading, onSubmit, regenerateLast, abortAnswer } = useAI();
    const messages = useAIMessages();
    const [input, setInput] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log('Current messages:', messages);
    }, [messages]);

    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new ResizeObserver(() => {
            const container = containerRef.current;
            if (!container) return;

            container.scrollTo({
                top: container.scrollHeight,
                behavior: 'instant',
            });
        });

        containerRef.current.scrollTop =
            containerRef.current.scrollHeight - containerRef.current.clientHeight;

        setTimeout(() => {
            const element = containerRef.current?.firstElementChild;
            if (element) {
                observer.observe(element);
            }
        }, 2000);

        return () => {
            observer.disconnect();
        };
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        console.log('Submitting message:', userMessage);
        setInput('');
        onSubmit(userMessage);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (!e.shiftKey && e.key === 'Enter') {
            e.preventDefault();
            handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
        }
    };

    return (
        <div className="flex flex-col h-[600px] relative bg-fd-background">
            <ScrollArea className="flex-1">
                <ScrollViewport ref={containerRef} className="p-4">
                    {messages.length === 0 ? (
                        <div className="text-center text-fd-muted-foreground p-4">
                            Test any API route or ask questions about the docs.
                        </div>
                    ) : (
                        messages.map((message, index) => (
                            <Message key={index} message={message} />
                        ))
                    )}
                    {loading && (
                        <div className="flex items-center gap-2 text-fd-muted-foreground">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>AI is thinking...</span>
                        </div>
                    )}
                </ScrollViewport>
            </ScrollArea>
            <div className="p-4 border-t bg-fd-background">
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                    <div className="flex gap-2">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            disabled={loading}
                            className="flex-1 min-h-[44px] p-3 rounded-lg border bg-fd-popover text-fd-popover-foreground placeholder:text-fd-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-primary resize-none"
                            onKeyDown={handleKeyDown}
                        />
                        {loading ? (
                            <Button
                                type="button"
                                onClick={abortAnswer}
                                className="rounded-full p-2"
                                variant="secondary"
                            >
                                <Loader2 className="w-4 h-4 animate-spin" />
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                disabled={!input.trim()}
                                className="rounded-full p-2"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        )}
                        {messages.length > 0 && !loading && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={regenerateLast}
                                className="rounded-full p-2"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
} 