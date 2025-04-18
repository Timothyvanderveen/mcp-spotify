import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import 'dotenv/config';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import tools from 'server/tools/index.js';
import manifest from '~/manifest.js';

const mcpServer = new Server(
  {
    name: `${manifest.name}-server`,
    version: manifest.version,
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

// List Tools

mcpServer.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: tools.map(({ schema }) => schema),
  };
});

// Call Tool

mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
  const tool = tools.find(({ schema }) => request.params.name === schema.name);

  if (tool) {
    return await tool.handler(request.params.arguments as any);
  }

  throw new Error('Tool not found');
});

async function main() {
  const transport = new StdioServerTransport();
  await mcpServer.connect(transport);
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
