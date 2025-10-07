import { getConfig, setConfig } from '../storage/configStore.js';

const WELCOME_CHANNEL_KEY = 'welcomeChannel';
const WELCOME_MESSAGE_KEY = 'welcomeMessage';

export function getWelcomeChannel() {
  return getConfig(WELCOME_CHANNEL_KEY);
}

export function setWelcomeChannel(channelId) {
  setConfig(WELCOME_CHANNEL_KEY, channelId);
}

export function getWelcomeMessage() {
  return getConfig(WELCOME_MESSAGE_KEY) || '환영해요~ {user}님! 🎉 젤리구름 놀이터에 오신 걸 환영해요!';
}

export function setWelcomeMessage(message) {
  setConfig(WELCOME_MESSAGE_KEY, message);
}

/**
 * 환영 메시지 전송
 */
export async function sendWelcomeMessage(member) {
  const channelId = getWelcomeChannel();
  if (!channelId) return;
  
  const channel = member.guild.channels.cache.get(channelId);
  if (!channel) return;
  
  try {
    const message = getWelcomeMessage()
      .replace('{user}', `<@${member.id}>`)
      .replace('{username}', member.user.username)
      .replace('{server}', member.guild.name)
      .replace('{count}', member.guild.memberCount.toString());
    
    await channel.send(message);
  } catch (error) {
    console.error('환영 메시지 전송 실패:', error);
  }
}
