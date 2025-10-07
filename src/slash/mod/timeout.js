import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { parseDuration, formatDuration } from '../../utils/helpers.js';
import { getDb } from '../../storage/database.js';
import { logAction } from '../../storage/logStore.js';

export const data = new SlashCommandBuilder()
  .setName('음소거')
  .setDescription('유저를 일정 시간 음소거')
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
  .addUserOption(option =>
    option.setName('유저')
      .setDescription('음소거할 유저')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('시간')
      .setDescription('음소거 시간 (예: 10m, 2h, 1d)')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('사유')
      .setDescription('음소거 사유')
      .setRequired(false)
  );

export async function execute(interaction) {
  const user = interaction.options.getUser('유저');
  const timeStr = interaction.options.getString('시간');
  const reason = interaction.options.getString('사유') || '사유 없음';
  
  const duration = parseDuration(timeStr);
  
  if (!duration) {
    return interaction.reply({
      content: '❌ 잘못된 시간 형식이에요~ (예: 10m, 2h, 1d)',
      ephemeral: true
    });
  }
  
  // 최대 28일 제한
  const maxDuration = 28 * 24 * 60 * 60 * 1000;
  if (duration > maxDuration) {
    return interaction.reply({
      content: '❌ 음소거는 최대 28일까지만 가능해요~',
      ephemeral: true
    });
  }
  
  const member = await interaction.guild.members.fetch(user.id).catch(() => null);
  
  if (!member) {
    return interaction.reply({
      content: '❌ 해당 유저를 찾을 수 없어요~',
      ephemeral: true
    });
  }
  
  // 봇이나 관리자는 음소거할 수 없음
  if (user.bot || member.permissions.has(PermissionFlagsBits.Administrator)) {
    return interaction.reply({
      content: '❌ 봇이나 관리자는 음소거할 수 없어요~',
      ephemeral: true
    });
  }
  
  try {
    await member.timeout(duration, reason);
    
    const db = getDb();
    const stmt = db.prepare(`
      INSERT INTO punishments (user_id, moderator_id, type, duration, reason, guild_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(user.id, interaction.user.id, 'timeout', timeStr, reason, interaction.guild.id);
    
    logAction('timeout', `${user.tag} - ${formatDuration(duration)}`, interaction.user.id, user.id);
    
    return interaction.reply({
      content: `✅ ${user.tag}님을 ${formatDuration(duration)} 동안 음소거했어요~ 🔇\n\n**사유:** ${reason}`,
      ephemeral: true
    });
  } catch (error) {
    console.error(error);
    return interaction.reply({
      content: '❌ 음소거 처리 중 오류가 발생했어요~',
      ephemeral: true
    });
  }
}
