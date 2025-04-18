import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const manifestPath = path.resolve(fileURLToPath(import.meta.url), '../../package.json');
const manifestFile = readFileSync(manifestPath, 'utf8');
export default JSON.parse(manifestFile);
