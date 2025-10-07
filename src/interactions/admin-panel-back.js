import { ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export const name = 'admin_panel_back';

export async function execute(interaction) {
  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('admin_panel_select')
    .setPlaceholder('관리 항목을 선택해주세요~ 🎛️')
    .addOptions([
      {
        label: '역할 관리',
        description: '자동 역할 설정 및 관리',
        value: 'role_management',
        emoji: '🎭'
      },
      {
        label: '신고 보기',
        description: '접수된 신고 목록 확인',
        value: 'view_reports',
        emoji: '📋'
      },
      {
        label: '로그 보기',
        description: '서버 활동 로그 확인',
        value: 'view_logs',
        emoji: '📜'
      },
      {
        label: '템플릿 관리',
        description: '서버 템플릿 저장/불러오기',
        value: 'template_management',
        emoji: '📝'
      },
      {
        label: '설정',
        description: '봇 설정 변경',
        value: 'settings',
        emoji: '⚙️'
      }
    ]);
  
  const closeButton = new ButtonBuilder()
    .setCustomId('admin_panel_close')
    .setLabel('닫기')
    .setStyle(ButtonStyle.Danger)
    .setEmoji('❌');
  
  const row1 = new ActionRowBuilder().addComponents(selectMenu);
  const row2 = new ActionRowBuilder().addComponents(closeButton);
  
  return interaction.update({
    content: '## 🎛️ 관리자 패널\n\n아래 메뉴에서 관리할 항목을 선택해주세요!',
    components: [row1, row2]
  });
}
