import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getDb } from '../../storage/database.js';

export const data = new SlashCommandBuilder()
  .setName('서버정보')
  .setDescription('서버 통계 및 정보');

export async function execute(interaction) {
  const guild = interaction.guild;
  const db = getDb();
  
  // 통계 수집
  const totalMembers = guild.memberCount;
  const botCount = guild.members.cache.filter(m => m.user.bot).size;
  const humanCount = totalMembers - botCount;
  
  const onlineMembers = guild.members.cache.filter(m => m.presence?.status === 'online').size;
  
  const textChannels = guild.channels.cache.filter(c => c.type === 0).size;
  const voiceChannels = guild.channels.cache.filter(c => c.type === 2).size;
  const categories = guild.channels.cache.filter(c => c.type === 4).size;
  
  const roleCount = guild.roles.cache.size;
  
  // 데이터베이스 통계
  const reportCount = db.prepare('SELECT COUNT(*) as count FROM reports WHERE guild_id = ?').get(guild.id)?.count || 0;
  const warningCount = db.prepare('SELECT COUNT(*) as count FROM warnings WHERE guild_id = ?').get(guild.id)?.count || 0;
  const logCount = db.prepare('SELECT COUNT(*) as count FROM logs').get()?.count || 0;
  
  const embed = new EmbedBuilder()
    .setColor('#9FD6FF')
    .setTitle(`📊 ${guild.name} 서버 정보`)
    .setThumbnail(guild.iconURL({ dynamic: true }))
    .addFields(
      {
        name: '👥 멤버',
        value: `총 **${totalMembers}명**\n사람: ${humanCount}명\n봇: ${botCount}명\n온라인: ${onlineMembers}명`,
        inline: true
      },
      {
        name: '📁 채널',
        value: `텍스트: ${textChannels}개\n음성: ${voiceChannels}개\n카테고리: ${categories}개`,
        inline: true
      },
      {
        name: '🎭 역할',
        value: `총 **${roleCount}개**`,
        inline: true
      },
      {
        name: '📋 활동 기록',
        value: `신고: ${reportCount}건\n경고: ${warningCount}건\n로그: ${logCount}건`,
        inline: false
      },
      {
        name: '📅 생성일',
        value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`,
        inline: false
      }
    )
    .setFooter({ text: `서버 ID: ${guild.id}` })
    .setTimestamp();

  return interaction.reply({ embeds: [embed] });
}
