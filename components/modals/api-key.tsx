import { buttonVariants } from '@/components/ui/button';
import {
    Credenza,
    CredenzaBody,
    CredenzaClose,
    CredenzaContent,
    CredenzaDescription,
    CredenzaFooter,
    CredenzaHeader,
    CredenzaTitle,
} from '@/components/ui/credenza';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface ApiKeyModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (key: string) => void;
}

export function ApiKeyModal({ open, onOpenChange, onSubmit }: ApiKeyModalProps) {
    const [showApiKey, setShowApiKey] = useState(false);

    return (
        <Credenza open={open} onOpenChange={onOpenChange}>
            <CredenzaContent>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const key = formData.get('apiKey') as string;
                    onSubmit(key);
                    onOpenChange(false);
                }}>
                    <CredenzaHeader>
                        <CredenzaTitle>Enter API Key</CredenzaTitle>
                        <CredenzaDescription>
                            Please enter your Meeting BaaS API key to continue.
                        </CredenzaDescription>
                    </CredenzaHeader>
                    <CredenzaBody>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label
                                    htmlFor="apiKey"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    API Key
                                </label>
                                <div className="relative">
                                    <input
                                        id="apiKey"
                                        name="apiKey"
                                        type={showApiKey ? "text" : "password"}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-10"
                                        placeholder="Enter your API key"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowApiKey(!showApiKey)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        aria-label={showApiKey ? "Hide API key" : "Show API key"}
                                    >
                                        {showApiKey ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </CredenzaBody>
                    <CredenzaFooter>
                        <div className="flex justify-end gap-2">
                            <CredenzaClose asChild>
                                <button
                                    type="button"
                                    className={buttonVariants({ variant: "outline" })}
                                >
                                    Cancel
                                </button>
                            </CredenzaClose>
                            <button
                                type="submit"
                                className={buttonVariants()}
                            >
                                Save
                            </button>
                        </div>
                    </CredenzaFooter>
                </form>
            </CredenzaContent>
        </Credenza>
    );
} 