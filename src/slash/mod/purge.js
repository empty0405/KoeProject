import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { logAction } from '../../storage/logStore.js';

export const data = new SlashCommandBuilder()
  .setName('정리')
  .setDescription('최근 메시지 삭제')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
  .addIntegerOption(option =>
    option.setName('개수')
      .setDescription('삭제할 메시지 개수 (1-100)')
      .setRequired(true)
      .setMinValue(1)
      .setMaxValue(100)
  );

export async function execute(interaction) {
  const amount = interaction.options.getInteger('개수');
  
  try {
    await interaction.deferReply({ ephemeral: true });
    
    // 14일 이상 지난 메시지는 삭제할 수 없음
    const messages = await interaction.channel.messages.fetch({ limit: amount });
    const recent = messages.filter(msg => Date.now() - msg.createdTimestamp < 14 * 24 * 60 * 60 * 1000);
    
    if (recent.size === 0) {
      return interaction.editReply('❌ 삭제할 수 있는 메시지가 없어요~ (14일 이내 메시지만 삭제 가능)');
    }
    
    await interaction.channel.bulkDelete(recent, true);
    
    logAction('message_purge', `${recent.size}개 메시지 삭제`, interaction.user.id);
    
    return interaction.editReply(`✅ 메시지 ${recent.size}개를 삭제했어요~ 🧹`);
  } catch (error) {
    console.error(error);
    return interaction.editReply('❌ 메시지 삭제 중 오류가 발생했어요~');
  }
}
