import { ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { getAutoRoles } from '../modules/autoRole.js';
import { getDb } from '../storage/database.js';
import { getRecentLogs } from '../storage/logStore.js';

export const name = 'admin_panel_select';

export async function execute(interaction) {
  const value = interaction.values[0];
  
  if (value === 'role_management') {
    const autoRoles = getAutoRoles();
    const guild = interaction.guild;
    
    const roleList = autoRoles.length > 0
      ? autoRoles.map(id => {
          const role = guild.roles.cache.get(id);
          return role ? `• ${role.name}` : `• (삭제된 역할: ${id})`;
        }).join('\n')
      : '없음';
    
    const backButton = new ButtonBuilder()
      .setCustomId('admin_panel_back')
      .setLabel('뒤로가기')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('◀️');
    
    const row = new ActionRowBuilder().addComponents(backButton);
    
    return interaction.update({
      content: `## 🎭 역할 관리\n\n**자동 역할 목록:**\n${roleList}\n\n자동 역할을 추가하려면 \`/자동역할 설정\` 명령을 사용해주세요!`,
      components: [row]
    });
  } else if (value === 'view_reports') {
    const db = getDb();
    const stmt = db.prepare(`
      SELECT * FROM reports
      WHERE guild_id = ? AND status = 'open'
      ORDER BY timestamp DESC
      LIMIT 10
    `);
    
    const reports = stmt.all(interaction.guild.id);
    
    const reportList = reports.length > 0
      ? reports.map(r => 
          `**#${r.id}** - <@${r.reported_id}> (신고자: <@${r.reporter_id}>)\n사유: ${r.reason}`
        ).join('\n\n')
      : '처리되지 않은 신고가 없어요~';
    
    const backButton = new ButtonBuilder()
      .setCustomId('admin_panel_back')
      .setLabel('뒤로가기')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('◀️');
    
    const row = new ActionRowBuilder().addComponents(backButton);
    
    return interaction.update({
      content: `## 📋 신고 목록\n\n${reportList}`,
      components: [row]
    });
  } else if (value === 'view_logs') {
    const logs = getRecentLogs(10);
    
    const logList = logs.length > 0
      ? logs.map(l => 
          `**${l.type}** - <@${l.actor}>${l.target ? ` → <@${l.target}>` : ''}\n${l.detail} (${l.timestamp})`
        ).join('\n\n')
      : '로그가 없어요~';
    
    const backButton = new ButtonBuilder()
      .setCustomId('admin_panel_back')
      .setLabel('뒤로가기')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('◀️');
    
    const row = new ActionRowBuilder().addComponents(backButton);
    
    return interaction.update({
      content: `## 📜 최근 로그\n\n${logList}`,
      components: [row]
    });
  } else if (value === 'template_management') {
    const backButton = new ButtonBuilder()
      .setCustomId('admin_panel_back')
      .setLabel('뒤로가기')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('◀️');
    
    const row = new ActionRowBuilder().addComponents(backButton);
    
    return interaction.update({
      content: `## 📝 템플릿 관리\n\n템플릿 관리는 \`/템플릿\` 명령을 사용해주세요!\n\n• \`/템플릿 저장\` - 현재 서버 구조 저장\n• \`/템플릿 목록\` - 저장된 템플릿 보기\n• \`/템플릿 적용\` - 템플릿 적용`,
      components: [row]
    });
  } else if (value === 'settings') {
    const backButton = new ButtonBuilder()
      .setCustomId('admin_panel_back')
      .setLabel('뒤로가기')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('◀️');
    
    const row = new ActionRowBuilder().addComponents(backButton);
    
    return interaction.update({
      content: `## ⚙️ 설정\n\n설정 기능은 추후 추가될 예정이에요~\n\n현재 사용 가능한 명령:\n• \`/자동역할\` - 자동 역할 관리\n• \`/정리\` - 메시지 삭제\n• \`/경고\`, \`/음소거\` - 모더레이션`,
      components: [row]
    });
  }
}
