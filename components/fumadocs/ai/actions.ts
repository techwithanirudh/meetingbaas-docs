'use server';

import { openai } from '@ai-sdk/openai';
import {
  experimental_createMCPClient as createMCPClient,
  smoothStream,
  streamText,
} from 'ai';
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
    let isStreamDone = false;

    try {
      const apiKey = process.env.MCP_API_KEY;
      client = await createMCPClient({
        transport: {
          type: 'sse',
          url: `https://baas-mcp-on-vercel.vercel.app/sse?X-Meeting-BaaS-Key=${apiKey}`,
        },
        onUncaughtError: (error) => {
          console.error('MCP Client error:', error);
          if (!isStreamDone) {
            stream.error('Connection timeout. Please try again.');
          }
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
        onError: (error) => {
          console.error('Stream error:', error);
          if (!isStreamDone) {
            stream.error(
              'An error occurred during streaming. Please try again.',
            );
          }
        },
        onFinish: () => {
          isStreamDone = true;
          stream.done();
        },
      });

      for await (const text of textStream) {
        stream.update(text);
      }

      isStreamDone = true;
      stream.done();
    } catch (error) {
      console.error('General error:', error);
      if (!isStreamDone) {
        if (error instanceof Error && error.message.includes('504')) {
          stream.error('Server timeout. Please try again.');
        } else {
          stream.error('An error occurred, please try again!');
        }
      }
    } finally {
      if (client) {
        try {
          await client.close();
        } catch (closeError) {
          console.error('Error closing client:', closeError);
        }
      }
    }
  })();

  return {
    messages: history,
    newMessage: stream.value,
  };
}
