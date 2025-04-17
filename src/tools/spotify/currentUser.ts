import { Tool } from '@modelcontextprotocol/sdk/types.js';
import spotify from '~/spotify.js';
import { ToolHandler } from '~/types/ToolHandler.js';

const schema: Tool = {
  name: 'spotify_current_user_profile',
  description: 'Get detailed profile information about the current user (including the current user\'s username).',
  inputSchema: {
    type: 'object',
    properties: {},
  },
};

const handler: ToolHandler = async () => {
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
