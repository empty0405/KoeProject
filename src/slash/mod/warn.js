import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { getDb } from '../../storage/database.js';
import { logAction } from '../../storage/logStore.js';

export const data = new SlashCommandBuilder()
  .setName('경고')
  .setDescription('유저에게 경고')
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
  .addUserOption(option =>
    option.setName('유저')
      .setDescription('경고할 유저')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('사유')
      .setDescription('경고 사유')
      .setRequired(true)
  );

export async function execute(interaction) {
  const user = interaction.options.getUser('유저');
  const reason = interaction.options.getString('사유');
  
  const member = await interaction.guild.members.fetch(user.id).catch(() => null);
  
  if (!member) {
    return interaction.reply({
      content: '❌ 해당 유저를 찾을 수 없어요~',
      ephemeral: true
    });
  }
  
  // 봇이나 관리자는 경고할 수 없음
  if (user.bot || member.permissions.has(PermissionFlagsBits.Administrator)) {
    return interaction.reply({
      content: '❌ 봇이나 관리자는 경고할 수 없어요~',
      ephemeral: true
    });
  }
  
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO warnings (user_id, moderator_id, reason, guild_id)
    VALUES (?, ?, ?, ?)
  `);
  
  stmt.run(user.id, interaction.user.id, reason, interaction.guild.id);
  
  // 경고 횟수 조회
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM warnings WHERE user_id = ? AND guild_id = ?');
  const { count } = countStmt.get(user.id, interaction.guild.id);
  
  logAction('warning', `${user.tag}에게 경고 (${count}회째)`, interaction.user.id, user.id);
  
  try {
    await user.send(`⚠️ **${interaction.guild.name}** 서버에서 경고를 받았어요!\n\n**사유:** ${reason}\n**경고 횟수:** ${count}회`);
  } catch (error) {
    // DM 전송 실패 시 무시
  }
  
  return interaction.reply({
    content: `✅ ${user.tag}님에게 경고했어요~ (총 ${count}회) ⚠️\n\n**사유:** ${reason}`,
    ephemeral: true
  });
}
