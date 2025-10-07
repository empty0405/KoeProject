# JellyGuard Bot 빠른 시작 가이드

이 가이드는 봇을 처음 설정하는 분들을 위한 단계별 안내입니다.

## 📋 사전 요구사항

- Node.js 18 이상
- Discord 애플리케이션 (봇 계정)
- 봇을 추가할 Discord 서버

## 🚀 1단계: Discord Bot 생성

1. [Discord Developer Portal](https://discord.com/developers/applications)에 접속
2. "New Application" 클릭 후 봇 이름 입력 (예: JellyGuard)
3. 좌측 메뉴에서 "Bot" 선택
4. "Add Bot" 클릭
5. "Reset Token" 클릭하여 토큰 생성 및 복사 (안전한 곳에 보관!)
6. "Privileged Gateway Intents" 섹션에서 다음 활성화:
   - Server Members Intent ✅
   - Message Content Intent ✅

## 🔑 2단계: 환경 변수 설정

1. 프로젝트 루트에 `.env` 파일 생성
2. 다음 내용 입력:

```env
BOT_TOKEN=여기에_봇_토큰_입력
APPLICATION_ID=여기에_애플리케이션_ID_입력
DEV_GUILD_ID=개발용_서버_ID_입력  # 선택사항
```

### 애플리케이션 ID 찾기:
- Developer Portal의 "General Information" 탭
- "Application ID" 복사

### 서버 ID (Guild ID) 찾기:
1. Discord 설정 → 고급 → 개발자 모드 활성화
2. 서버 우클릭 → ID 복사

## 🤖 3단계: 봇 권한 설정

1. Developer Portal에서 "OAuth2" → "URL Generator" 선택
2. **SCOPES** 선택:
   - `bot` ✅
   - `applications.commands` ✅

3. **BOT PERMISSIONS** 선택:
   - Manage Roles ✅
   - Manage Messages ✅
   - Read Messages/View Channels ✅
   - Send Messages ✅
   - Moderate Members ✅
   - Read Message History ✅
   - Use Application Commands ✅

4. 생성된 URL로 봇 초대

## 📦 4단계: 설치 및 실행

```bash
# 의존성 설치
npm install

# 명령어 등록 (최초 1회 또는 명령어 변경 시)
npm run deploy:commands

# 봇 실행
npm start
```

## ⚙️ 5단계: 초기 설정

Discord 서버에서 다음 명령어를 실행하세요:

### 1. 역할 위치 조정
- 서버 설정 → 역할
- 봇의 역할을 관리하려는 역할들보다 **위**에 배치

### 2. 자동 역할 설정
```
/자동역할 설정 역할:@멤버역할
```

### 3. 환영 메시지 설정 (선택사항)
```
/환영메시지 채널 채널:#환영
/환영메시지 내용 메시지:환영해요 {user}님! 🎉
```

### 4. 역할 선택 UI 생성
```
/역할선택 시작
```

## ✅ 6단계: 테스트

다음을 확인하세요:
- [ ] 봇이 온라인 상태인가요?
- [ ] `/도움말` 명령어가 작동하나요?
- [ ] 새 멤버가 입장하면 자동으로 역할을 받나요?
- [ ] 역할 선택 메뉴가 정상 작동하나요?

## 🎭 역할 설정 예시

서버에 다음 역할들을 만들어보세요:

1. **젤리요정** (#FF8DAA) - 관리자
2. **블루젤리** (#9FD6FF) - 스태프
3. **딸기젤리** (#FFB6C1) - 기본 멤버
4. **포도젤리** (#C39BFF) - 활동 유저
5. **멜론젤리** (#A3E4D7) - 이벤트 참여자

> ⚠️ 봇 역할은 반드시 이 역할들보다 위에!

## 🔧 개발 모드

개발 중에는 `npm run dev`를 사용하면 파일 변경 시 자동으로 재시작됩니다.

## 📝 추가 명령어

자세한 명령어 목록은 `/도움말`을 실행하거나 README.md를 참조하세요.

## 🐛 문제 해결

### 봇이 시작되지 않아요
- `.env` 파일이 있는지 확인
- `BOT_TOKEN`과 `APPLICATION_ID`가 올바른지 확인

### 명령어가 나타나지 않아요
- `npm run deploy:commands` 실행했는지 확인
- 전역 배포는 1시간 정도 소요 (DEV_GUILD_ID 사용 권장)

### 역할을 부여할 수 없어요
- 봇 역할이 대상 역할보다 위에 있는지 확인
- 봇에게 "Manage Roles" 권한이 있는지 확인

## 🎉 완료!

이제 JellyGuard Bot이 서버를 관리할 준비가 되었습니다!

더 많은 정보는 [README.md](README.md)를 참조하세요.
