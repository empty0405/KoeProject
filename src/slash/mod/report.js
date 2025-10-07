import { SlashCommandBuilder } from 'discord.js';
import { getDb } from '../../storage/database.js';

export const data = new SlashCommandBuilder()
  .setName('신고')
  .setDescription('유저 신고')
  .addUserOption(option =>
    option.setName('유저')
      .setDescription('신고할 유저')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('사유')
      .setDescription('신고 사유')
      .setRequired(true)
  );

export async function execute(interaction) {
  const user = interaction.options.getUser('유저');
  const reason = interaction.options.getString('사유');
  
  // 자기 자신을 신고하는 경우
  if (user.id === interaction.user.id) {
    return interaction.reply({
      content: '❌ 자기 자신을 신고할 수 없어요~',
      ephemeral: true
    });
  }
  
  // 봇을 신고하는 경우
  if (user.bot) {
    return interaction.reply({
      content: '❌ 봇은 신고할 수 없어요~',
      ephemeral: true
    });
  }
  
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO reports (reporter_id, reported_id, reason, guild_id, channel_id)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  stmt.run(
    interaction.user.id,
    user.id,
    reason,
    interaction.guild.id,
    interaction.channel.id
  );
  
  await interaction.reply({
    content: `✅ 신고 접수했어요~ 운영진이 확인할게요! 📝\n\n**신고 대상:** ${user.tag}\n**사유:** ${reason}`,
    ephemeral: true
  });
  
  // 운영진 채널에 알림 (로그 채널이 설정되어 있다면)
  // 추후 설정 기능 추가 시 구현
}
