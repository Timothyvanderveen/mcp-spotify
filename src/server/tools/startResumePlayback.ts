import { Tool } from '@modelcontextprotocol/sdk/types.js';
import spotify from 'server/spotify.js';
import { ToolHandler, ToolInput } from 'server/types/index.js';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const inputSchema = z.object({
  device_id: z.string().describe('The id of the device this command is targeting. If not supplied, the user\'s currently active device is the target.'),
  context_uri: z.string().describe('Optional. Spotify URI of the context to play. Valid contexts are albums, artists & playlists. {context_uri:"spotify:album:1Je1IMUlBXcx1Fz0WE7oPT"}'),
  uris: z.string().array().describe('Optional. A JSON array of the Spotify track URIs to play. For example: {"uris": ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh", "spotify:track:1301WleyT98MSxVHPZCA6M"]}'),
  offset: z.object({
    position: z.number(),
    uri: z.string(),
  }).describe('Optional. Indicates from where in the context playback should start. Only available when context_uri corresponds to an album or playlist object "position" is zero based and can’t be negative. Example: "offset": {"position": 5} "uri" is a string representing the uri of the item to start at. Example: "offset": {"uri": "spotify:track:1301WleyT98MSxVHPZCA6M"}'),
  position_ms: z.number(),
});

const schema = {
  name: 'spotify_start_resume_playback',
  description: 'Start a new context or resume current playback on the user\'s active device.',
  inputSchema: zodToJsonSchema(inputSchema) as ToolInput,
} satisfies Tool;

const handler: ToolHandler<typeof inputSchema> = async (args) => {
  await spotify.player.startResumePlayback(
    args.device_id,
    args.context_uri,
    args.uris,
    args.offset,
    args.position_ms,
  );

  return {
    content: [
      {
        type: 'text',
        text: 'Playback started/resumed',
      },
    ],
  };
};

export default {
  schema,
  handler,
};
