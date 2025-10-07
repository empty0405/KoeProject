import 'dotenv/config';
import { Client, GatewayIntentBits, Events } from 'discord.js';
import { loadCommands } from './loader/commands.js';
import { loadInteractions } from './loader/interactions.js';
import * as logger from './utils/logger.js';

// 환경 변수 검증
if (!process.env.BOT_TOKEN) {
  logger.error('❌ BOT_TOKEN 환경 변수가 설정되지 않았어요!');
  logger.info('📝 .env 파일을 생성하고 BOT_TOKEN을 설정해주세요.');
  process.exit(1);
}

if (!process.env.APPLICATION_ID) {
  logger.error('❌ APPLICATION_ID 환경 변수가 설정되지 않았어요!');
  logger.info('📝 .env 파일에 APPLICATION_ID를 추가해주세요.');
  process.exit(1);
}

// Discord 클라이언트 생성
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// 명령어 및 인터랙션 로드
await loadCommands(client);
await loadInteractions(client);

// clientReady 이벤트 (v15 호환성)
client.once(Events.ClientReady, (c) => {
  logger.success(`로그인 완료: ${c.user.tag}`);
  logger.info(`${c.guilds.cache.size}개 서버에서 활동 중`);
});

// 새 멤버 입장 이벤트
client.on(Events.GuildMemberAdd, async (member) => {
  logger.info(`새 멤버 입장: ${member.user.tag} (${member.guild.name})`);
  
  try {
    // 자동 역할 부여
    const { assignAutoRoles } = await import('./modules/autoRole.js');
    await assignAutoRoles(member);
    
    // 환영 메시지 전송
    const { sendWelcomeMessage } = await import('./modules/welcome.js');
    await sendWelcomeMessage(member);
  } catch (error) {
    logger.error('새 멤버 처리 실패:', error);
  }
});

// 인터랙션 이벤트
client.on(Events.InteractionCreate, async (interaction) => {
  try {
    // 슬래시 명령
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      
      if (!command) {
        logger.warn(`알 수 없는 명령: ${interaction.commandName}`);
        return;
      }
      
      logger.info(`명령 실행: /${interaction.commandName} by ${interaction.user.tag}`);
      await command.execute(interaction);
    }
    // 셀렉트 메뉴
    else if (interaction.isStringSelectMenu()) {
      const handler = client.interactions.get(interaction.customId);
      
      if (handler) {
        await handler(interaction);
      }
    }
    // 버튼
    else if (interaction.isButton()) {
      const handler = client.interactions.get(interaction.customId);
      
      if (handler) {
        await handler(interaction);
      }
    }
  } catch (error) {
    logger.error('인터랙션 처리 오류:', error);
    
    const errorMessage = '❌ 처리 중 오류가 발생했어요~';
    
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: errorMessage, ephemeral: true });
    } else {
      await interaction.reply({ content: errorMessage, ephemeral: true });
    }
  }
});

// 에러 핸들링
client.on('error', (error) => {
  logger.error('클라이언트 오류:', error);
});

process.on('unhandledRejection', (error) => {
  logger.error('처리되지 않은 Promise 거부:', error);
});

// 봇 로그인
client.login(process.env.BOT_TOKEN);
