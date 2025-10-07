import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { getDb } from '../../storage/database.js';
import { logAction } from '../../storage/logStore.js';

export const data = new SlashCommandBuilder()
  .setName('템플릿')
  .setDescription('서버 템플릿 관리')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .addSubcommand(subcommand =>
    subcommand
      .setName('저장')
      .setDescription('현재 서버 구조를 템플릿으로 저장')
      .addStringOption(option =>
        option.setName('이름')
          .setDescription('템플릿 이름')
          .setRequired(true)
      )
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('적용')
      .setDescription('저장된 템플릿을 서버에 적용')
      .addStringOption(option =>
        option.setName('이름')
          .setDescription('템플릿 이름')
          .setRequired(true)
      )
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('목록')
      .setDescription('저장된 템플릿 목록 보기')
  );

export async function execute(interaction) {
  const subcommand = interaction.options.getSubcommand();
  const db = getDb();
  
  if (subcommand === '저장') {
    const name = interaction.options.getString('이름');
    
    // 서버 구조 수집
    const templateData = {
      roles: interaction.guild.roles.cache
        .filter(role => role.id !== interaction.guild.id) // @everyone 제외
        .map(role => ({
          name: role.name,
          color: role.color,
          permissions: role.permissions.bitfield.toString(),
          position: role.position,
          hoist: role.hoist,
          mentionable: role.mentionable
        })),
      channels: interaction.guild.channels.cache.map(channel => ({
        name: channel.name,
        type: channel.type,
        position: channel.position,
        parentId: channel.parentId
      }))
    };
    
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO templates (name, data, guild_id)
      VALUES (?, ?, ?)
    `);
    
    stmt.run(name, JSON.stringify(templateData), interaction.guild.id);
    logAction('template_save', `템플릿 저장: ${name}`, interaction.user.id);
    
    return interaction.reply({
      content: `✅ 템플릿 "${name}"을(를) 저장했어요~ 📝`,
      ephemeral: true
    });
  } else if (subcommand === '적용') {
    const name = interaction.options.getString('이름');
    
    const stmt = db.prepare('SELECT data FROM templates WHERE name = ? AND guild_id = ?');
    const row = stmt.get(name, interaction.guild.id);
    
    if (!row) {
      return interaction.reply({
        content: `❌ "${name}" 템플릿을 찾을 수 없어요~`,
        ephemeral: true
      });
    }
    
    await interaction.reply({
      content: `⚠️ 템플릿 적용은 서버 구조를 크게 변경할 수 있어요. 신중하게 사용해주세요!\n\n(실제 적용 기능은 위험할 수 있어 구현되지 않았어요)`,
      ephemeral: true
    });
    
    logAction('template_apply_attempt', `템플릿 적용 시도: ${name}`, interaction.user.id);
  } else if (subcommand === '목록') {
    const stmt = db.prepare('SELECT name, created_at FROM templates WHERE guild_id = ? ORDER BY created_at DESC');
    const templates = stmt.all(interaction.guild.id);
    
    if (templates.length === 0) {
      return interaction.reply({
        content: '❌ 저장된 템플릿이 없어요~ `/템플릿 저장`으로 먼저 템플릿을 만들어주세요!',
        ephemeral: true
      });
    }
    
    const list = templates.map(t => `• **${t.name}** (${t.created_at})`).join('\n');
    
    return interaction.reply({
      content: `## 📝 저장된 템플릿 목록\n\n${list}`,
      ephemeral: true
    });
  }
}
