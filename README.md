# KOE PROJECT - 한국어 디스코드 봇

KOE PROJECT는 한국어로 번역된 Discord 봇입니다.

## 기능

- **한국어 슬래시 명령어**: 모든 명령어가 한국어로 제공됩니다
- **오류 처리**: 한국어로 오류 메시지를 표시합니다
- **응답성**: 빠른 응답 시간을 제공합니다

## 사용 가능한 명령어

- `/핑` - 봇의 응답 시간을 확인합니다
- `/정보` - 봇의 정보를 표시합니다
- `/도움말` - 사용 가능한 명령어 목록을 보여줍니다

## 설치 및 설정

1. 저장소를 클론합니다:
```bash
git clone https://github.com/empty0405/KoeProject.git
cd KoeProject
```

2. 필요한 패키지를 설치합니다:
```bash
npm install
```

3. 환경 설정 파일을 만듭니다:
```bash
cp .env.example .env
```

4. `.env` 파일을 편집하여 봇 토큰과 클라이언트 ID를 입력합니다:
```
BOT_TOKEN=여기에_봇_토큰을_입력하세요
CLIENT_ID=여기에_클라이언트_ID를_입력하세요
```

5. 봇을 실행합니다:
```bash
npm start
```

## Discord 봇 생성 방법

1. [Discord Developer Portal](https://discord.com/developers/applications)에 접속합니다
2. "New Application"을 클릭하고 봇 이름을 입력합니다
3. "Bot" 탭으로 이동하여 "Add Bot"을 클릭합니다
4. 봇 토큰을 복사하여 `.env` 파일에 추가합니다
5. "OAuth2" → "URL Generator"에서 "bot"과 "applications.commands" 권한을 선택합니다
6. 생성된 URL을 통해 봇을 서버에 초대합니다

## 요구사항

- Node.js 16.9.0 이상
- Discord.js v14
- Discord 봇 토큰

## 라이선스

MIT License
