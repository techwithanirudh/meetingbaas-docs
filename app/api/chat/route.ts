import { openai } from "@ai-sdk/openai";
import { experimental_createMCPClient, generateText, Message, smoothStream, streamText } from "ai";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const {
    messages,
  }: {
    messages: Array<Message>;
  } = await request.json();

  let client;

  try {
    client = await experimental_createMCPClient({
      transport: {
        type: "sse",
        url: "https://model-context-protocol-mcp-with-vercel-functions-psi.vercel.app/sse",
      },
    });

    const tools = await client.tools();

    const result = streamText({
      model: openai("gpt-4o-mini"),
      tools,
      maxSteps: 10,
      experimental_transform: [
        smoothStream({
          chunking: 'word',
        }),
      ],
      onStepFinish: async ({ toolResults }) => {
        console.log(`STEP RESULTS: ${JSON.stringify(toolResults, null, 2)}`);
      },
      system:
        "you are a friendly assistant. do not use emojis in your responses.",
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to generate text" });
  } finally {
    await client?.close();
  }
}
