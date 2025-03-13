'use server';

import {
  experimental_createMCPClient as createMCPClient,
  smoothStream,
  streamText,
} from 'ai';
import { openai } from '@ai-sdk/openai';
import { createStreamableValue } from 'ai/rsc';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function continueConversation({
  history,
  abortSignal,
}: {
  history: Message[];
  abortSignal?: AbortSignal | undefined;
}) {
  const stream = createStreamableValue();

  (async () => {
    let client;

    try {
      client = await createMCPClient({
        transport: {
          type: 'sse',
          url: 'https://model-context-protocol-mcp-with-vercel-functions-psi.vercel.app/sse',
        },
      });

      const toolSet = await client.tools();
      const tools = { ...toolSet };

      const { textStream } = streamText({
        system:
          'You are a friendly assistant. Do not use emojis in your responses. Make sure to format code blocks, and add language/title to it',
        tools,
        model: openai('gpt-4o-mini'),
        experimental_transform: [
          smoothStream({
            chunking: 'word',
          }),
        ],
        maxSteps: 5,
        messages: history,
        // abortSignal,
      });

      for await (const text of textStream) {
        stream.update(text);
      }

      stream.done();
    } catch (error) {
      console.error(error);
      stream.error('An error occurred, please try again!');
    } finally {
      if (client) {
        await Promise.all([client.close()]);
      }
    }
  })();

  return {
    messages: history,
    newMessage: stream.value,
  };
}
