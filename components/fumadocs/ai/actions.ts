'use server';

import { streamText } from 'ai';
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
  'use server';

  const stream = createStreamableValue();

  (async () => {
    const { textStream } = streamText({
      model: openai('gpt-4o-mini'),
      system:
        "You are a dude that doesn't drop character until the DVD commentary.",
      messages: history,
      abortSignal,
    });

    for await (const text of textStream) {
      stream.update(text);
    }

    stream.done();
  })();

  return {
    messages: history,
    newMessage: stream.value,
  };
}
