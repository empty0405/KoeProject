const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes, EmbedBuilder } = require('discord.js');
require('dotenv').config();

// 유틸리티와 언어 팩 불러오기
const ErrorHandler = require('./utils/errorHandler');
const config = require('./config.json');
const lang = require('./languages/ko');

// 봇 클라이언트 생성
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// 시작 시간 저장 (가동 시간 계산용)
const startTime = Date.now();

// 슬래시 명령어 정의
const commands = [
    new SlashCommandBuilder()
        .setName(lang.commands.ping.name)
        .setDescription(lang.commands.ping.description),
    
    new SlashCommandBuilder()
        .setName(lang.commands.info.name)
        .setDescription(lang.commands.info.description),
    
    new SlashCommandBuilder()
        .setName(lang.commands.help.name)
        .setDescription(lang.commands.help.description),
];

// 유틸리티 함수들
function formatUptime(uptime) {
    const days = Math.floor(uptime / (24 * 60 * 60 * 1000));
    const hours = Math.floor((uptime % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((uptime % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((uptime % (60 * 1000)) / 1000);
    
    return `${days}일 ${hours}시간 ${minutes}분 ${seconds}초`;
}

// 봇이 준비되었을 때
client.once('ready', async () => {
    console.log(lang.bot.ready);
    console.log(`${client.user.tag}${lang.bot.loggedIn}`);
    
    // 슬래시 명령어 등록
    try {
        const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);
        
        console.log('슬래시 명령어를 등록하는 중...');
        
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );
        
        console.log('슬래시 명령어가 성공적으로 등록되었습니다!');
    } catch (error) {
        ErrorHandler.handleBotError('명령어 등록', error);
    }
});

// 슬래시 명령어 처리
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    
    try {
        const { commandName } = interaction;
        
        switch (commandName) {
            case lang.commands.ping.name:
                const pingEmbed = new EmbedBuilder()
                    .setColor(config.embedColor)
                    .setTitle('🏓 Pong!')
                    .setDescription(lang.commands.ping.response.replace('{ping}', Date.now() - interaction.createdTimestamp))
                    .setTimestamp();
                
                await interaction.reply({ embeds: [pingEmbed] });
                break;
                
            case lang.commands.info.name:
                const uptime = formatUptime(Date.now() - startTime);
                const infoEmbed = new EmbedBuilder()
                    .setColor(config.embedColor)
                    .setTitle(lang.commands.info.response.title)
                    .addFields([
                        { name: lang.commands.info.response.name, value: config.botName, inline: true },
                        { name: lang.commands.info.response.version, value: config.version, inline: true },
                        { name: lang.commands.info.response.author, value: 'empty0405', inline: true },
                        { name: lang.commands.info.response.language, value: '한국어 (Korean)', inline: true },
                        { name: lang.commands.info.response.uptime, value: uptime, inline: true },
                        { name: lang.commands.info.response.servers, value: client.guilds.cache.size.toString(), inline: true },
                    ])
                    .setThumbnail(client.user.displayAvatarURL())
                    .setTimestamp();
                
                await interaction.reply({ embeds: [infoEmbed] });
                break;
                
            case lang.commands.help.name:
                const helpEmbed = new EmbedBuilder()
                    .setColor(config.embedColor)
                    .setTitle(lang.commands.help.response.title)
                    .setDescription('사용 가능한 명령어 목록입니다:')
                    .addFields([
                        { name: `/${lang.commands.ping.name}`, value: lang.commands.ping.description, inline: false },
                        { name: `/${lang.commands.info.name}`, value: lang.commands.info.description, inline: false },
                        { name: `/${lang.commands.help.name}`, value: lang.commands.help.description, inline: false },
                    ])
                    .setFooter({ text: lang.commands.help.response.footer })
                    .setTimestamp();
                
                await interaction.reply({ embeds: [helpEmbed] });
                break;
                
            default:
                await interaction.reply({ 
                    content: lang.errors.commandNotFound, 
                    ephemeral: true 
                });
        }
    } catch (error) {
        await ErrorHandler.handleInteractionError(interaction, error);
    }
});

// 오류 처리
client.on('error', (error) => {
    ErrorHandler.handleBotError('클라이언트', error);
});

// WebSocket 오류 처리
client.on('shardError', (error) => {
    ErrorHandler.handleNetworkError(error);
});

// 재연결 시도
client.on('shardReconnecting', () => {
    console.log(lang.bot.reconnecting);
});

// 연결 완료
client.on('shardReady', () => {
    console.log(lang.bot.connected);
});

// 처리되지 않은 Promise 거부 처리
process.on('unhandledRejection', (reason, promise) => {
    console.error('처리되지 않은 Promise 거부:', reason);
    console.log('Promise:', promise);
});

// 처리되지 않은 예외 처리
process.on('uncaughtException', (error) => {
    console.error('처리되지 않은 예외:', error);
    process.exit(1);
});

// Graceful shutdown 처리
process.on('SIGINT', () => {
    console.log(lang.bot.shutdown);
    client.destroy();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log(lang.bot.shutdown);
    client.destroy();
    process.exit(0);
});

// 환경 변수 검증 및 봇 로그인
function validateEnvironment() {
    const requiredVars = ['BOT_TOKEN', 'CLIENT_ID'];
    const missing = requiredVars.filter(varName => !process.env[varName]);
    
    if (missing.length > 0) {
        console.error(`❌ 오류: 다음 환경 변수가 설정되지 않았습니다: ${missing.join(', ')}`);
        console.error('📝 .env 파일을 확인해주세요.');
        process.exit(1);
    }
    
    return true;
}

// 봇 시작
if (validateEnvironment()) {
    console.log('🚀 KOE PROJECT 봇을 시작합니다...');
    client.login(process.env.BOT_TOKEN)
        .catch(error => {
            ErrorHandler.handleBotError('로그인', error);
            process.exit(1);
        });
}