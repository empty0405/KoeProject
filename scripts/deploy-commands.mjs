import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const commands = [];
const slashDir = join(__dirname, '../src/slash');

// 명령어 수집
async function collectCommands(dir) {
  const items = readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = join(dir, item.name);
    
    if (item.isDirectory()) {
      await collectCommands(fullPath);
    } else if (item.name.endsWith('.js')) {
      try {
        const module = await import(`file://${fullPath}`);
        if (module.data) {
          commands.push(module.data.toJSON());
        }
      } catch (error) {
        console.error(`명령 로드 실패: ${item.name}`, error);
      }
    }
  }
}

await collectCommands(slashDir);

console.log(`📦 ${commands.length}개 명령 수집 완료`);

// REST 클라이언트 생성
const rest = new REST().setToken(process.env.BOT_TOKEN);

try {
  console.log('🔄 슬래시 명령 등록 시작...');
  
  // 개발 서버에만 등록 (빠름)
  if (process.env.DEV_GUILD_ID) {
    await rest.put(
      Routes.applicationGuildCommands(process.env.APPLICATION_ID, process.env.DEV_GUILD_ID),
      { body: commands }
    );
    console.log(`✅ ${commands.length}개 명령을 개발 서버에 등록 완료!`);
  } else {
    // 전역 등록 (최대 1시간 지연)
    await rest.put(
      Routes.applicationCommands(process.env.APPLICATION_ID),
      { body: commands }
    );
    console.log(`✅ ${commands.length}개 명령을 전역으로 등록 완료! (반영까지 최대 1시간 소요)`);
  }
} catch (error) {
  console.error('❌ 명령 등록 실패:', error);
  process.exit(1);
}
