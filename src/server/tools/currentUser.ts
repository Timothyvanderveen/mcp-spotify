import { Tool } from '@modelcontextprotocol/sdk/types.js';
import spotify from 'server/spotify.js';
import { ToolHandler, ToolInput } from 'server/types/index.js';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const inputSchema = z.object({});

const schema = {
  name: 'current_user',
  description: 'Get detailed profile information about the current user (including the current user\'s username).',
  inputSchema: zodToJsonSchema(inputSchema) as ToolInput,
} satisfies Tool;

const handler: ToolHandler<typeof inputSchema> = async () => {
  const profile = await spotify.currentUser.profile();

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(profile),
      },
    ],
  };
};

export default {
  schema,
  handler,
};
