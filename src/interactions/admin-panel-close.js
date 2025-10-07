export const name = 'admin_panel_close';

export async function execute(interaction) {
  return interaction.update({
    content: '✅ 관리자 패널을 닫았어요~',
    components: []
  });
}
