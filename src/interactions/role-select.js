import { logAction } from '../storage/logStore.js';

export const name = 'role_select';

export async function execute(interaction) {
  try {
    const selectedRoleIds = interaction.values;
    const member = interaction.member;
    
    // 현재 가지고 있는 선택 가능한 역할들
    const { getAutoRoles } = await import('../modules/autoRole.js');
    const selectableRoles = getAutoRoles();
    
    const currentSelectableRoles = member.roles.cache.filter(role => 
      selectableRoles.includes(role.id)
    );
    
    // 제거할 역할 (선택하지 않은 역할)
    const rolesToRemove = currentSelectableRoles.filter(role => 
      !selectedRoleIds.includes(role.id)
    );
    
    // 추가할 역할 (새로 선택한 역할)
    const rolesToAdd = selectedRoleIds.filter(roleId => 
      !member.roles.cache.has(roleId)
    );
    
    // 역할 제거
    for (const role of rolesToRemove.values()) {
      await member.roles.remove(role);
    }
    
    // 역할 추가
    for (const roleId of rolesToAdd) {
      const role = interaction.guild.roles.cache.get(roleId);
      if (role) {
        await member.roles.add(role);
      }
    }
    
    logAction('role_select', `역할 선택: ${selectedRoleIds.length}개`, member.id);
    
    const roleNames = selectedRoleIds
      .map(id => interaction.guild.roles.cache.get(id)?.name)
      .filter(Boolean)
      .join(', ');
    
    return interaction.reply({
      content: `✅ 역할을 업데이트했어요~ 🎭\n\n**선택한 역할:** ${roleNames || '없음'}`,
      ephemeral: true
    });
  } catch (error) {
    console.error(error);
    return interaction.reply({
      content: '❌ 역할 업데이트 중 오류가 발생했어요~',
      ephemeral: true
    });
  }
}
