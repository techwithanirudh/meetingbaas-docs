import type { Engine, MessageRecord } from '@/components/fumadocs/ai/context';
import { readStreamableValue } from 'ai/rsc';
import { continueConversation } from '../actions';

export async function createAiSdkEngine(): Promise<Engine> {
  let conversation: MessageRecord[] = [];
  let abortController: AbortController | null = null;

  async function fetchStream(
    userMessages: MessageRecord[],
    onUpdate?: (full: string) => void,
    onEnd?: (full: string) => void,
  ) {
    if (abortController) {
      abortController.abort();
    }
    abortController = new AbortController();

    try {
      let textContent = '';
      const { messages, newMessage } = await continueConversation({
        history: userMessages,
      });

      for await (const delta of readStreamableValue(newMessage)) {
        if (abortController.signal.aborted) {
          break;
        }

        textContent = `${textContent}${delta}`;
        conversation = [
          ...messages,
          { role: 'assistant', content: textContent },
        ];
        onUpdate?.(textContent);
      }

      if (!abortController.signal.aborted) {
        onEnd?.(textContent);
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
    } finally {
      if (abortController && abortController.signal.aborted) {
        abortController = null;
      }
    }
  }

  return {
    async prompt(text, onUpdate, onEnd) {
      conversation.push({
        role: 'user',
        content: text,
      });

      await fetchStream(conversation, onUpdate, onEnd);
    },
    async regenerateLast(onUpdate, onEnd) {
      const last = conversation.at(-1);
      if (!last || last.role === 'user') {
        return;
      }

      conversation.pop();

      await fetchStream(conversation, onUpdate, onEnd);
    },
    getHistory() {
      return conversation;
    },
    clearHistory() {
      conversation = [];
    },
    abortAnswer() {
      abortController?.abort();
    },
  };
}
