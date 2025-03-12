import type { Engine, MessageRecord } from "@/components/fumadocs/ai/context";

export async function createAiSdkEngine(): Promise<Engine> {
  let messages: MessageRecord[] = [];
  let abortController: AbortController | null = null;

  async function fetchStream(
    userMessages: MessageRecord[],
    onUpdate?: (full: string) => void,
    onEnd?: (full: string) => void,
  ) {
    abortController = new AbortController();

    // todo use ai sdk usechat
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: userMessages.map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
          selectedModelId: 'gpt-4o-mini', // Default model
          isReasoningEnabled: true, // Default setting
        }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is null');
      }

      const decoder = new TextDecoder();
      let content = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        // Parse SSE format to extract the content
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ') && !line.includes('[DONE]')) {
            try {
              const data = JSON.parse(line.substring(6));
              if (data.type === 'text') {
                content += data.text || '';
                onUpdate?.(content);
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }

      onEnd?.(content);
      return content;
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Error in AI stream:', error);
        const errorMessage = "Sorry, an error occurred while generating a response.";
        onEnd?.(errorMessage);
        return errorMessage;
      }
      return '';
    }
  }

  return {
    async prompt(text, onUpdate, onEnd) {
      messages.push({
        role: 'user',
        content: text,
      });

      const content = await fetchStream(messages, onUpdate, onEnd);
      
      messages.push({
        role: 'assistant',
        content,
      });
    },
    async regenerateLast(onUpdate, onEnd) {
      const last = messages.at(-1);
      if (!last || last.role === 'user') {
        return;
      }

      messages.pop();
      
      const content = await fetchStream(messages, onUpdate, onEnd);
      
      messages.push({
        role: 'assistant',
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