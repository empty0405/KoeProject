# 🛡️ JellyGuard Bot

젤리구름 놀이터 서버의 관리를 자동화하고 사용자 친화적 상호작용을 제공하는 Discord 봇입니다.

## ✨ 주요 기능

### 🎭 역할 자동화
- 새 멤버 입장 시 자동으로 역할 부여
- 관리자 역할은 자동 부여 대상에서 자동 제외
- 셀렉트 메뉴를 통한 역할 선택 UI 제공

### 🛠️ 관리자 도구
- `/관리자패널` - 통합 관리 인터페이스
- `/정리` - 메시지 대량 삭제 (최대 100개)
- `/템플릿` - 서버 구조 저장/불러오기

### ⚖️ 모더레이션
- `/경고` - 유저에게 경고 부여
- `/음소거` - 일정 시간 동안 유저 음소거
- `/신고` - 유저 신고 시스템

### 🎮 유틸리티
- `/젤리뽑기` - 랜덤 뽑기 이벤트
- `/역할 현재` - 유저 역할 확인
- 로그 및 감사 추적 기능

## 📋 명령어 목록

| 명령어 | 설명 | 권한 |
|--------|------|------|
| `/자동역할 설정 <역할>` | 자동 부여할 역할 추가 | 관리자 |
| `/자동역할 해제 <역할>` | 자동 역할에서 제거 | 관리자 |
| `/역할선택 시작` | 역할 선택 UI 메시지 전송 | 관리자 |
| `/역할 현재 <@유저>` | 유저의 역할 확인 | 관리자/본인 |
| `/정리 <개수>` | 메시지 삭제 (1-100개) | 스태프 |
| `/경고 <@유저> <사유>` | 유저에게 경고 | 스태프 |
| `/음소거 <@유저> <시간> [사유]` | 유저 음소거 (예: 10m, 2h, 1d) | 스태프 |
| `/신고 <@유저> <사유>` | 유저 신고 접수 | 모두 |
| `/관리자패널` | 관리자 통합 패널 | 관리자 |
| `/템플릿 저장/적용/목록` | 서버 템플릿 관리 | 관리자 |
| `/젤리뽑기` | 랜덤 뽑기 이벤트 | 모두 |

## 🚀 설치 및 설정

### 1. 저장소 클론
```bash
git clone <repository-url>
cd KoeProject
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
`.env` 파일을 생성하고 다음 내용을 입력하세요:

```env
BOT_TOKEN=your_discord_bot_token_here
APPLICATION_ID=your_application_id_here
DEV_GUILD_ID=your_dev_guild_id_here  # 선택사항 (개발용)
```

### 4. Discord Bot 설정
1. [Discord Developer Portal](https://discord.com/developers/applications)에서 애플리케이션 생성
2. Bot 탭에서 봇 생성 및 토큰 복사
3. OAuth2 → URL Generator에서 다음 권한 선택:
   - `bot`
   - `applications.commands`
4. Bot Permissions:
   - Manage Roles
   - Manage Messages
   - Read Messages/View Channels
   - Send Messages
   - Moderate Members
   - Read Message History
   - Use Application Commands

### 5. 명령어 배포
```bash
npm run deploy:commands
```

개발 서버에 빠르게 배포하려면 `.env`에 `DEV_GUILD_ID`를 설정하세요. 전역 배포는 최대 1시간이 소요될 수 있습니다.

### 6. 봇 실행
```bash
npm start
# 또는 개발 모드 (자동 재시작)
npm run dev
```

## 🎨 역할 구조

| 역할명 | 색상 | 자동 부여 | 설명 |
|--------|------|-----------|------|
| 👑 젤리요정 | #FF8DAA | ❌ | 최고 관리자 (자동화 제외) |
| 🫐 블루젤리 | #9FD6FF | 설정 가능 | 스태프 수준 |
| 🍓 딸기젤리 | #FFB6C1 | ✅ | 기본 멤버 |
| 🍇 포도젤리 | #C39BFF | ✅ | 활동 유저 |
| 🍈 멜론젤리 | #A3E4D7 | ✅ | 이벤트 참여자 |
| 🍑 복숭아젤리 | #FFD2B8 | ✅ | VIP/후원자 |

> ⚠️ **중요**: 봇의 역할이 관리할 역할들보다 위에 있어야 합니다!

## 📁 프로젝트 구조

```
KoeProject/
├── src/
│   ├── index.js                 # 메인 봇 파일
│   ├── slash/                   # 슬래시 명령
│   │   ├── roles/              # 역할 관련 명령
│   │   ├── mod/                # 모더레이션 명령
│   │   ├── admin/              # 관리자 명령
│   │   └── utility/            # 유틸리티 명령
│   ├── interactions/            # UI 인터랙션 핸들러
│   ├── modules/                 # 기능 모듈
│   │   └── autoRole.js         # 자동 역할 시스템
│   ├── storage/                 # 데이터베이스 레이어
│   │   ├── database.js         # SQLite 데이터베이스
│   │   ├── configStore.js      # 설정 저장소
│   │   └── logStore.js         # 로그 저장소
│   ├── utils/                   # 유틸리티 함수
│   │   ├── logger.js           # 로거
│   │   └── helpers.js          # 헬퍼 함수
│   └── loader/                  # 명령/인터랙션 로더
├── scripts/
│   └── deploy-commands.mjs      # 명령 배포 스크립트
├── data/                        # 데이터베이스 파일 (자동 생성)
├── .env                         # 환경 변수 (직접 생성)
└── package.json
```

## 🗄️ 데이터베이스

봇은 SQLite를 사용하여 다음 데이터를 저장합니다:

- **config**: 봇 설정 및 자동 역할 목록
- **logs**: 모든 주요 활동 로그
- **reports**: 유저 신고 내역
- **warnings**: 경고 기록
- **punishments**: 음소거 등 처벌 기록
- **templates**: 서버 템플릿

데이터는 `data/jellyguard.db` 파일에 저장됩니다.

## 🔒 보안 주의사항

- `.env` 파일을 절대 공유하거나 커밋하지 마세요!
- 봇 토큰이 노출되면 즉시 재생성하세요.
- 관리자 권한은 신뢰할 수 있는 사람에게만 부여하세요.

## 🐛 문제 해결

### 봇이 역할을 부여하지 못해요
- 봇의 역할이 대상 역할보다 위에 있는지 확인하세요.
- 봇에게 "Manage Roles" 권한이 있는지 확인하세요.

### 명령어가 나타나지 않아요
- `npm run deploy:commands`를 실행했는지 확인하세요.
- 전역 배포는 최대 1시간이 소요될 수 있습니다.
- 개발 서버에 빠르게 배포하려면 `DEV_GUILD_ID`를 설정하세요.

### 자동 역할이 작동하지 않아요
- `/자동역할 설정` 명령으로 역할을 추가했는지 확인하세요.
- 관리자 권한이 있는 유저는 자동으로 제외됩니다.

## 📝 라이선스

ISC

## 🤝 기여

버그 리포트나 기능 제안은 이슈로 등록해주세요!

---

**Made with 💜 for 젤리구름 놀이터**
