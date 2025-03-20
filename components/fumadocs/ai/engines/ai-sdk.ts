import type { Engine, MessageRecord } from "@/components/fumadocs/ai/context";
import { consumeReadableStream } from "@/lib/consume-stream";

export async function createAiSdkEngine(): Promise<Engine> {
  let messages: MessageRecord[] = [];
  let abortController: AbortController | null = null;

  async function fetchStream(
    userMessages: MessageRecord[],
    onUpdate?: (full: string) => void,
    onEnd?: (full: string) => void
  ) {
    abortController = new AbortController();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: userMessages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let textContent = "";

      if (response.body) {
        await consumeReadableStream(
          response.body,
          (chunk) => {
            try {
              textContent += chunk;
            } catch (error) {
              console.error("Error parsing JSON:", error);
            }

            messages = [
              ...messages,
              { role: 'assistant', content: textContent },
            ];
          
            onUpdate?.(textContent);
          },
          abortController.signal
        );
      } else {
        throw new Error("Response body is null");
      }

      onEnd?.(textContent);
      return textContent;
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Error in AI stream:", error);
        const errorMessage =
          "Sorry, an error occurred while generating a response.";
        onEnd?.(errorMessage);
        return errorMessage;
      }
      return "";
    }
  }

  return {
    async prompt(text, onUpdate, onEnd) {
      messages.push({
        role: "user",
        content: text,
      });

      const content = await fetchStream(messages, onUpdate, onEnd);

      messages.push({
        role: "assistant",
        content,
      });
    },
    async regenerateLast(onUpdate, onEnd) {
      const last = messages.at(-1);
      if (!last || last.role === "user") {
        return;
      }

      messages.pop();

      const content = await fetchStream(messages, onUpdate, onEnd);

      messages.push({
        role: "assistant",
        content,
      });
    },
    getHistory() {
      return messages;
    },
    clearHistory() {
      messages = [];
    },
    abortAnswer() {
      abortController?.abort();
    },
  };
}
