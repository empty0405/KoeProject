import { SlashCommandBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { setWelcomeChannel, setWelcomeMessage, getWelcomeChannel, getWelcomeMessage } from '../../modules/welcome.js';

export const data = new SlashCommandBuilder()
  .setName('환영메시지')
  .setDescription('환영 메시지 설정')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .addSubcommand(subcommand =>
    subcommand
      .setName('채널')
      .setDescription('환영 메시지를 보낼 채널 설정')
      .addChannelOption(option =>
        option.setName('채널')
          .setDescription('환영 메시지 채널')
          .addChannelTypes(ChannelType.GuildText)
          .setRequired(true)
      )
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('내용')
      .setDescription('환영 메시지 내용 설정')
      .addStringOption(option =>
        option.setName('메시지')
          .setDescription('환영 메시지 (변수: {user}, {username}, {server}, {count})')
          .setRequired(true)
      )
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('확인')
      .setDescription('현재 환영 메시지 설정 확인')
  );

export async function execute(interaction) {
  const subcommand = interaction.options.getSubcommand();
  
  if (subcommand === '채널') {
    const channel = interaction.options.getChannel('채널');
    setWelcomeChannel(channel.id);
    
    return interaction.reply({
      content: `✅ 환영 메시지 채널을 ${channel}로 설정했어요~ 🎉`,
      ephemeral: true
    });
  } else if (subcommand === '내용') {
    const message = interaction.options.getString('메시지');
    setWelcomeMessage(message);
    
    return interaction.reply({
      content: `✅ 환영 메시지를 설정했어요~ 📝\n\n**미리보기:**\n${message.replace('{user}', `<@${interaction.user.id}>`).replace('{username}', interaction.user.username).replace('{server}', interaction.guild.name).replace('{count}', interaction.guild.memberCount.toString())}`,
      ephemeral: true
    });
  } else if (subcommand === '확인') {
    const channelId = getWelcomeChannel();
    const message = getWelcomeMessage();
    
    const channel = channelId ? `<#${channelId}>` : '설정 안 됨';
    
    return interaction.reply({
      content: `## 환영 메시지 설정\n\n**채널:** ${channel}\n**메시지:**\n${message}\n\n**사용 가능한 변수:** \`{user}\`, \`{username}\`, \`{server}\`, \`{count}\``,
      ephemeral: true
    });
  }
}
