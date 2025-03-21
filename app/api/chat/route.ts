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

const MCP_SERVER_URL =
  process.env.MCP_SERVER_URL ||
  'https://model-context-protocol-mcp-with-vercel-functions-psi.vercel.app/sse';
const MCP_API_KEY = process.env.MCP_API_KEY;

export async function POST(request: NextRequest) {
  const {
    messages,
  }: {
    messages: Array<Message>;
  } = await request.json();

  try {
    // Add authorization header to the URL if API key is present
    const url = new URL(MCP_SERVER_URL);
    if (MCP_API_KEY) {
      url.searchParams.set('authorization', `Bearer ${MCP_API_KEY}`);
    }

    let client = await createMCPClient({
      transport: {
        type: 'sse',
        url: url.toString(),
      },
      onUncaughtError: (error) => {
        client.close();
        console.error('MCP Client error:', error);
      },
    });

    const toolSet = await client.tools();
    const tools = { ...toolSet };

    const result = streamText({
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
