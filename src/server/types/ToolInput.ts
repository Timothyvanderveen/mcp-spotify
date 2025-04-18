import { ToolSchema } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

export type ToolInput = z.infer<typeof ToolSchema.shape.inputSchema>;
