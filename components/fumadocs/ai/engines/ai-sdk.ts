import type { Engine, MessageRecord } from '@/components/fumadocs/ai/context';
import { processChatResponse } from '@/lib/consume-stream';
import { generateId } from 'ai';
import type { Message, ToolCall, } from "ai";

export async function createAiSdkEngine(): Promise<Engine> {
  let messages: Message[] = [];
  let controller: AbortController | null = null;
  let apiKey: string | null = null;

  async function fetchStream(
    userMessages: Message[],
    onUpdate?: (full: string) => void,
    onEnd?: (full: string) => void,
  ) {
    apiKey = localStorage.getItem('meetingbaas-api-key');
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
          apiKey: apiKey || '',
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let textContent = '';

      const onToolCall = async (props: { toolCall: ToolCall<string, unknown> }) => {
        const { toolCall: tool } = props;
        if (tool.toolName === 'setApiKey') {
          const parameters = tool.args as { apiKey: string };
          apiKey = parameters?.apiKey;

          localStorage.setItem('meetingbaas-api-key', apiKey);
        }
      };

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
          onToolCall: onToolCall,
          onFinish({ message, finishReason }) {
            onEnd?.(message?.content || '');
            // console.log('chat', finishReason);
          },
          generateId,
        });
      } else {
        throw new Error('Response body is null');
      }

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
