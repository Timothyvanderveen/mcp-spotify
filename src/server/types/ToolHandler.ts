import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { z, ZodType } from 'zod';

export type ToolHandler<T extends ZodType> = (args: z.infer<T>) => Promise<CallToolResult>;
