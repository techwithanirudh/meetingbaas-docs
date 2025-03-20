'use server';

import { openai } from '@ai-sdk/openai';
import { Experimental_StdioMCPTransport as StdioMCPTransport } from 'ai/mcp-stdio';

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

    try {
      client = await createMCPClient({
        transport: new StdioMCPTransport({
          command: 'npx',
          args: ["-y", "@modelcontextprotocol/server-memory"] ,
        }),
        onUncaughtError: (error) => {
          console.error('MCP Client error:', error);
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
        maxSteps: 10,
        messages: history,
        onStepFinish: async ({ toolResults }) => {
          console.log(`STEP RESULTS: ${JSON.stringify(toolResults, null, 2)}`);
        },
        // todo: abortSignal, is broken, bcs it auto aborts, revert ai code for abort
        // https://github.com/vercel/ai/issues/1122
      });

      try {
        for await (const text of textStream) {
          stream.update(text);
        }
      } finally {
        stream.done();
      }
    } catch (error) {
      console.error(error);
      stream.error('An error occurred, please try again!');
    } finally {
      client?.close();
    }
  })();

  return {
    messages: history,
    newMessage: stream.value,
  };
}
