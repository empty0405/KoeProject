import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('역할')
  .setDescription('역할 관리')
  .addSubcommand(subcommand =>
    subcommand
      .setName('현재')
      .setDescription('유저의 현재 역할 확인')
      .addUserOption(option =>
        option.setName('유저')
          .setDescription('확인할 유저')
          .setRequired(true)
      )
  );

export async function execute(interaction) {
  const subcommand = interaction.options.getSubcommand();
  
  if (subcommand === '현재') {
    const user = interaction.options.getUser('유저');
    const member = await interaction.guild.members.fetch(user.id);
    
    // 자신이 아니면 관리자 권한 필요
    if (user.id !== interaction.user.id && !interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
      return interaction.reply({
        content: '❌ 다른 유저의 역할을 확인할 권한이 없어요~',
        ephemeral: true
      });
    }
    
    const roles = member.roles.cache
      .filter(role => role.id !== interaction.guild.id) // @everyone 제외
      .sort((a, b) => b.position - a.position)
      .map(role => role.toString())
      .join(', ');
    
    return interaction.reply({
      content: `**${member.displayName}**님의 역할 목록이에요~ 🎭\n\n${roles || '역할이 없어요~'}`,
      ephemeral: true
    });
  }
}
