import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { getDb } from '../../storage/database.js';

export const data = new SlashCommandBuilder()
  .setName('유저정보')
  .setDescription('유저 정보 조회')
  .addUserOption(option =>
    option.setName('유저')
      .setDescription('조회할 유저')
      .setRequired(false)
  );

export async function execute(interaction) {
  const user = interaction.options.getUser('유저') || interaction.user;
  const member = await interaction.guild.members.fetch(user.id);
  const db = getDb();
  
  // 권한 확인 (다른 유저 조회는 스태프만 가능)
  if (user.id !== interaction.user.id && !interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
    return interaction.reply({
      content: '❌ 다른 유저의 정보를 조회할 권한이 없어요~',
      ephemeral: true
    });
  }
  
  // 경고 및 처벌 기록
  const warningStmt = db.prepare('SELECT COUNT(*) as count FROM warnings WHERE user_id = ? AND guild_id = ?');
  const warningCount = warningStmt.get(user.id, interaction.guild.id)?.count || 0;
  
  const punishmentStmt = db.prepare('SELECT COUNT(*) as count FROM punishments WHERE user_id = ? AND guild_id = ?');
  const punishmentCount = punishmentStmt.get(user.id, interaction.guild.id)?.count || 0;
  
  // 역할 목록
  const roles = member.roles.cache
    .filter(role => role.id !== interaction.guild.id)
    .sort((a, b) => b.position - a.position)
    .map(role => role.toString())
    .slice(0, 10);
  
  const embed = new EmbedBuilder()
    .setColor(member.displayHexColor || '#5865F2')
    .setTitle(`👤 ${user.tag}`)
    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
    .addFields(
      {
        name: '📋 기본 정보',
        value: `**ID:** ${user.id}\n**별명:** ${member.displayName}\n**봇:** ${user.bot ? '예' : '아니오'}`,
        inline: true
      },
      {
        name: '📅 날짜',
        value: `**가입일:** <t:${Math.floor(user.createdTimestamp / 1000)}:R>\n**입장일:** <t:${Math.floor(member.joinedTimestamp / 1000)}:R>`,
        inline: true
      },
      {
        name: '🎭 역할',
        value: roles.length > 0 ? roles.join(' ') : '없음',
        inline: false
      }
    );
  
  // 모더레이션 기록 (스태프에게만 표시)
  if (interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
    embed.addFields({
      name: '⚖️ 모더레이션 기록',
      value: `경고: **${warningCount}회**\n처벌: **${punishmentCount}회**`,
      inline: false
    });
  }
  
  embed.setFooter({ text: '젤리가드봇' })
    .setTimestamp();

  return interaction.reply({ embeds: [embed], ephemeral: true });
}
