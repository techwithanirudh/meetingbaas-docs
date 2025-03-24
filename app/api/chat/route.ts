import { openai } from '@ai-sdk/openai';
import {
  experimental_createMCPClient as createMCPClient,
  InvalidToolArgumentsError,
  Message,
  NoSuchToolError,
  smoothStream,
  streamText,
  ToolExecutionError,
} from 'ai';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const {
    messages,
  }: {
    messages: Array<Message>;
  } = await request.json();

  try {
    let client = await createMCPClient({
      transport: {
        type: 'sse',
        url: 'https://mcp.meetingbaas.com/sse',
      },
      onUncaughtError: (error) => {
        console.error('MCP Client error:', error);
      },
    });

    const toolSet = await client.tools();
    const tools = { ...toolSet };

    const result = streamText({
      // todo: add models.ts file
      model: openai('gpt-4o-mini'),
      tools,
      maxSteps: 10,
      experimental_transform: [
        smoothStream({
          chunking: 'word',
        }),
      ],
      onStepFinish: async ({ toolResults }) => {
        console.log(`Step Results: ${JSON.stringify(toolResults, null, 2)}`);
      },
      onFinish: async () => {
        client.close();
      },
      onError: async () => {
        client.close();
      },
      system:
        'You are a friendly assistant. Do not use emojis in your responses. Make sure to format code blocks, and add language/title to it',
      messages,
    });

    return result.toDataStreamResponse({
      getErrorMessage: (error) => {
        if (NoSuchToolError.isInstance(error)) {
          return 'The model tried to call a unknown tool.';
        } else if (InvalidToolArgumentsError.isInstance(error)) {
          return 'The model called a tool with invalid arguments.';
        } else if (ToolExecutionError.isInstance(error)) {
          console.log(error);
          return 'An error occurred during tool execution.';
        } else {
          return 'An unknown error occurred.';
        }
      },
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to generate text' });
  }
}
