import { tool as createTool } from 'ai';
import { z } from 'zod';

export const apiKeyTool = createTool({
  description: 'Asks the user to provide their MeetingBaas API Key',
  parameters: z.object({
    reason: z.string().describe('The reason why the user is being asked for their API Key'),
  }),
  execute: async function ({ reason }) {
    // await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      message: `Please provide your MeetingBaas API Key. ${reason}`,
    };
  },
});

export const tools = {
  askApiKey: apiKeyTool,
};