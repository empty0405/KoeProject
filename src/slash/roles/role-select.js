import { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import { getAutoRoles } from '../../modules/autoRole.js';

export const data = new SlashCommandBuilder()
  .setName('역할선택')
  .setDescription('역할 선택 UI 관리')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
  .addSubcommand(subcommand =>
    subcommand
      .setName('시작')
      .setDescription('유저가 역할을 선택할 수 있는 메시지 전송')
  );

export async function execute(interaction) {
  const subcommand = interaction.options.getSubcommand();
  
  if (subcommand === '시작') {
    const autoRoleIds = getAutoRoles();
    
    if (autoRoleIds.length === 0) {
      return interaction.reply({
        content: '❌ 자동 역할이 설정되어 있지 않아요~ `/자동역할 설정` 명령으로 먼저 역할을 추가해주세요!',
        ephemeral: true
      });
    }
    
    // 역할 옵션 생성
    const options = [];
    for (const roleId of autoRoleIds) {
      const role = interaction.guild.roles.cache.get(roleId);
      if (role) {
        options.push({
          label: role.name,
          value: roleId,
          description: `${role.name} 역할을 선택해요`,
          emoji: '🎭'
        });
      }
    }
    
    if (options.length === 0) {
      return interaction.reply({
        content: '❌ 사용 가능한 역할이 없어요~',
        ephemeral: true
      });
    }
    
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('role_select')
      .setPlaceholder('역할을 선택해주세요~ 🎭')
      .setMinValues(0)
      .setMaxValues(options.length)
      .addOptions(options);
    
    const row = new ActionRowBuilder().addComponents(selectMenu);
    
    await interaction.channel.send({
      content: '## 🎭 역할 선택\n\n아래 메뉴에서 원하는 역할을 선택해주세요! 여러 개 선택도 가능해요~ 💫',
      components: [row]
    });
    
    return interaction.reply({
      content: '✅ 역할 선택 메시지를 전송했어요~',
      ephemeral: true
    });
  }
}
