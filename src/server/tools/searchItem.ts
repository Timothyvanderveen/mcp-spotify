import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { MaxInt } from '@spotify/web-api-ts-sdk';
import spotify from 'server/spotify.js';
import { ToolHandler, ToolInput } from 'src/server/types/index.js';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const inputSchema = z.object({
  query: z.string().describe(`
    Your search query.
    You can narrow down your search using field filters. The available filters are album, artist, track, year, upc, tag:hipster, tag:new, isrc, and genre. Each field filter only applies to certain result types.
    The artist and year filters can be used while searching albums, artists and tracks. You can filter on a single year or a range (e.g. 1955-1960).
    The album filter can be used while searching albums and tracks.
    The genre filter can be used while searching artists and tracks.
    The isrc and track filters can be used while searching tracks.
    The upc, tag:new and tag:hipster filters can only be used while searching albums. The tag:new filter will return albums released in the past two weeks and tag:hipster can be used to return only albums with the lowest 10% popularity.
    Example: q=remaster%2520track%3ADoxy%2520artist%3AMiles%2520Davis
  `),
  type: z.array(z.enum(['artist', 'album', 'playlist', 'track', 'show', 'episode', 'audiobook'])).describe(`
    A comma-separated list of item types to search across. Search results include hits from all the specified item types. 
    For example: q=abacab&type=album,track returns both albums and tracks matching "abacab".
  `),
  limit: z.number().min(0).max(50).default(20).optional().describe(`The maximum number of results to return in each item type.`),
  offset: z.number().min(0).max(1000).default(0).optional().describe(`The index of the first result to return. Use with limit to get the next page of search results.`),
});

const schema = {
  name: 'search_item',
  description: 'Get Spotify catalog information about albums, artists, playlists, tracks, shows, episodes or audiobooks that match a keyword string.',
  inputSchema: zodToJsonSchema(inputSchema) as ToolInput,
} satisfies Tool;

const handler: ToolHandler<typeof inputSchema> = async (args) => {
  const searchResult = await spotify.search(
    args.query,
    args.type,
    undefined,
    args.limit as MaxInt<50>,
    args.offset,
    undefined,
  );

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(searchResult),
      },
    ],
  };
};

export default {
  schema,
  handler,
};
