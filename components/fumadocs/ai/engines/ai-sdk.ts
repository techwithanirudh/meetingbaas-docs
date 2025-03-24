import type { Engine, MessageRecord } from '@/components/fumadocs/ai/context';
import { processChatResponse } from '@/lib/consume-stream';
import { generateId } from 'ai';
import type { Message, } from "ai";

export async function createAiSdkEngine(): Promise<Engine> {
  let messages: Message[] = [];
  let controller: AbortController | null = null;

  async function fetchStream(
    userMessages: Message[],
    onUpdate?: (full: string) => void,
    onEnd?: (full: string) => void,
  ) {
    controller = new AbortController();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: userMessages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let textContent = '';

      if (response.body) {
        await processChatResponse({
          stream: response.body,
          update: (chunk) => {
            textContent = chunk.message.content;
            onUpdate?.(textContent);
          },
          lastMessage: {
            ...messages[messages.length - 1],
            parts: []
          },
          onToolCall: (tool) => {
            console.log(tool);
          },
          onFinish({ message, finishReason }) {
            console.log(message, finishReason);
          },
          generateId,
        });
      } else {
        throw new Error('Response body is null');
      }

      onEnd?.(textContent);
      return textContent;
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Error in AI stream:', error);
        const errorMessage =
          'Sorry, an error occurred while generating a response.';
        onEnd?.(errorMessage);
        return errorMessage;
      }
      return '';
    }
  }

  return {
    async prompt(text, onUpdate, onEnd) {
      messages.push({
        id: generateId(),
        role: 'user',
        content: text,
      });

      const response = await fetchStream(messages, onUpdate, onEnd);
      messages.push({
        id: generateId(),
        role: 'assistant',
        content: response,
      });
    },
    async regenerateLast(onUpdate, onEnd) {
      const last = messages.at(-1);
      if (!last || last.role === 'user') {
        return;
      }

      messages.pop();

      const response = await fetchStream(messages, onUpdate, onEnd);
      messages.push({
        id: generateId(),
        role: 'assistant',
        content: response,
      });
    },
    getHistory() {
      return messages as MessageRecord[];
    },
    clearHistory() {
      messages = [];
    },
    abortAnswer() {
      controller?.abort();
    },
  };
}
