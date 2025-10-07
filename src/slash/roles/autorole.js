import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { addAutoRole } from '../../modules/autoRole.js';

export const data = new SlashCommandBuilder()
  .setName('자동역할')
  .setDescription('자동 역할 관리')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
  .addSubcommand(subcommand =>
    subcommand
      .setName('설정')
      .setDescription('새 멤버에게 자동으로 부여할 역할 추가')
      .addRoleOption(option =>
        option.setName('역할')
          .setDescription('자동 부여할 역할')
          .setRequired(true)
      )
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('해제')
      .setDescription('자동 역할 목록에서 역할 제거')
      .addRoleOption(option =>
        option.setName('역할')
          .setDescription('제거할 역할')
          .setRequired(true)
      )
  );

export async function execute(interaction) {
  const subcommand = interaction.options.getSubcommand();
  const role = interaction.options.getRole('역할');
  
  // 관리자 권한 확인
  if (role.permissions.has('Administrator')) {
    return interaction.reply({
      content: '❌ 관리자 역할은 자동 역할로 설정할 수 없어요~',
      ephemeral: true
    });
  }
  
  // 봇 역할이 대상 역할보다 위에 있는지 확인
  const botMember = interaction.guild.members.me;
  if (botMember.roles.highest.position <= role.position) {
    return interaction.reply({
      content: '❌ 제 역할이 대상 역할보다 낮아서 관리할 수 없어요~',
      ephemeral: true
    });
  }
  
  if (subcommand === '설정') {
    const { removeAutoRole } = await import('../../modules/autoRole.js');
    const success = addAutoRole(role.id, interaction.user.id);
    
    if (success) {
      return interaction.reply({
        content: `✅ ${role.name} 역할을 자동 역할로 추가했어요~ 새 멤버가 들어오면 자동으로 부여될 거예요! 🎉`,
        ephemeral: true
      });
    } else {
      return interaction.reply({
        content: `⚠️ ${role.name} 역할은 이미 자동 역할 목록에 있어요~`,
        ephemeral: true
      });
    }
  } else if (subcommand === '해제') {
    const { removeAutoRole } = await import('../../modules/autoRole.js');
    const success = removeAutoRole(role.id, interaction.user.id);
    
    if (success) {
      return interaction.reply({
        content: `✅ ${role.name} 역할을 자동 역할 목록에서 제거했어요~`,
        ephemeral: true
      });
    } else {
      return interaction.reply({
        content: `⚠️ ${role.name} 역할은 자동 역할 목록에 없어요~`,
        ephemeral: true
      });
    }
  }
}
