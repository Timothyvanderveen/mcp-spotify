import { Tool } from '@modelcontextprotocol/sdk/types.js';
import spotify from 'server/spotify.js';
import { ToolHandler, ToolInput } from 'src/server/types/index.js';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const inputSchema = z.object({});

const schema = {
  name: 'get_available_devices',
  description: 'Get information about a user’s available Spotify Connect devices. Some device models are not supported and will not be listed in the API response.',
  inputSchema: zodToJsonSchema(inputSchema) as ToolInput,
} satisfies Tool;

const handler: ToolHandler<typeof inputSchema> = async () => {
  const availableDevices = await spotify.player.getAvailableDevices();

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(availableDevices),
      },
    ],
  };
};

export default {
  schema,
  handler,
};
