import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('젤리뽑기')
  .setDescription('젤리 랜덤 뽑기 이벤트! 🎰');

export async function execute(interaction) {
  const jellies = [
    { name: '딸기젤리', emoji: '🍓', rarity: '흔함', color: '#FFB6C1' },
    { name: '포도젤리', emoji: '🍇', rarity: '흔함', color: '#C39BFF' },
    { name: '멜론젤리', emoji: '🍈', rarity: '보통', color: '#A3E4D7' },
    { name: '복숭아젤리', emoji: '🍑', rarity: '보통', color: '#FFD2B8' },
    { name: '블루젤리', emoji: '🫐', rarity: '레어', color: '#9FD6FF' },
    { name: '황금젤리', emoji: '✨', rarity: '전설', color: '#FFD700' }
  ];
  
  // 희귀도별 확률 가중치
  const weights = {
    '흔함': 40,
    '보통': 30,
    '레어': 20,
    '전설': 10
  };
  
  // 가중치 기반 랜덤 선택
  const totalWeight = jellies.reduce((sum, j) => sum + weights[j.rarity], 0);
  let random = Math.random() * totalWeight;
  
  let selected = jellies[0];
  for (const jelly of jellies) {
    random -= weights[jelly.rarity];
    if (random <= 0) {
      selected = jelly;
      break;
    }
  }
  
  await interaction.reply({
    content: `## 🎰 젤리 뽑기 결과!\n\n${selected.emoji} **${selected.name}**을(를) 뽑았어요!\n희귀도: **${selected.rarity}**\n\n축하해요~ 🎉`
  });
}
