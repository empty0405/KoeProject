import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function loadInteractions(client) {
  const handlers = new Map();
  const interactionsDir = join(__dirname, '../interactions');
  
  const files = readdirSync(interactionsDir).filter(f => f.endsWith('.js'));
  
  for (const file of files) {
    try {
      const fullPath = join(interactionsDir, file);
      const module = await import(`file://${fullPath}`);
      
      if (module.name && module.execute) {
        handlers.set(module.name, module.execute);
      }
    } catch (error) {
      logger.error(`인터랙션 로드 실패: ${file}`, error);
    }
  }
  
  client.interactions = handlers;
  logger.info(`🔌 인터랙션 핸들러 ${handlers.size}개 로드 완료`);
}
