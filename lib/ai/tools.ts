import { tool as createTool } from 'ai';
import { z } from 'zod';

export const setApiKeyTool = createTool({
  description: 'Stores the user\'s MeetingBaas API Key, in storage, so in the future the user does not have to provide it again',
  parameters: z.object({
    apiKey: z.string().describe('The MeetingBaas API Key'),
  }),
  execute: async function ({ apiKey }) {
    // await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      message: `Storing MeetingBaas API Key: ${apiKey}`,
    };
  },
});
