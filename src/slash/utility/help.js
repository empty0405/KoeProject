import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('도움말')
  .setDescription('봇 사용법 및 명령어 목록');

export async function execute(interaction) {
  const embed = new EmbedBuilder()
    .setColor('#FF8DAA')
    .setTitle('🛡️ JellyGuard Bot 도움말')
    .setDescription('젤리구름 놀이터 서버의 관리를 도와주는 봇이에요~ 🎭')
    .addFields(
      {
        name: '🎭 역할 관리',
        value: '`/자동역할 설정/해제` - 자동 역할 관리\n`/역할선택 시작` - 역할 선택 UI 생성\n`/역할 현재` - 유저 역할 확인',
        inline: false
      },
      {
        name: '⚖️ 모더레이션',
        value: '`/정리` - 메시지 삭제\n`/경고` - 유저 경고\n`/음소거` - 유저 타임아웃\n`/신고` - 유저 신고',
        inline: false
      },
      {
        name: '🛠️ 관리자 도구',
        value: '`/관리자패널` - 통합 관리 패널\n`/템플릿` - 서버 템플릿 관리\n`/환영메시지` - 환영 메시지 설정',
        inline: false
      },
      {
        name: '🎮 유틸리티',
        value: '`/젤리뽑기` - 랜덤 뽑기 이벤트\n`/도움말` - 이 메시지\n`/서버정보` - 서버 통계\n`/유저정보` - 유저 정보 조회',
        inline: false
      },
      {
        name: '💡 팁',
        value: '• 역할 선택 UI를 만들려면 먼저 `/자동역할 설정`으로 역할을 추가하세요\n• 관리자 패널에서 서버 로그와 신고를 확인할 수 있어요\n• 음소거 시간은 10m, 2h, 1d 형식으로 입력하세요',
        inline: false
      },
      {
        name: '🔗 유용한 링크',
        value: '[GitHub Repository](https://github.com/empty0405/KoeProject)',
        inline: false
      }
    )
    .setFooter({ text: '젤리가드봇 💜' })
    .setTimestamp();

  return interaction.reply({ embeds: [embed], ephemeral: true });
}
