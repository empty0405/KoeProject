import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function loadCommands(client) {
  const commands = new Map();
  const slashDir = join(__dirname, '../slash');
  
  async function loadFromDir(dir) {
    const items = readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = join(dir, item.name);
      
      if (item.isDirectory()) {
        await loadFromDir(fullPath);
      } else if (item.name.endsWith('.js')) {
        try {
          const module = await import(`file://${fullPath}`);
          if (module.data && module.execute) {
            commands.set(module.data.name, module);
          }
        } catch (error) {
          logger.error(`명령 로드 실패: ${item.name}`, error);
        }
      }
    }
  }
  
  await loadFromDir(slashDir);
  client.commands = commands;
  logger.info(`📦 Slash 명령 ${commands.size}개 로드 완료`);
}
