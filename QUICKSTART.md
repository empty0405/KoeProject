# 🚀 Quick Start

최소한의 단계로 빠르게 시작하기

## 1️⃣ 환경 설정 (1분)

```bash
# .env 파일 생성
cp .env.example .env
```

`.env` 파일을 열고 다음 정보 입력:
- `BOT_TOKEN` - [Discord Developer Portal](https://discord.com/developers/applications)에서 생성
- `APPLICATION_ID` - 동일한 페이지에서 복사
- `DEV_GUILD_ID` (선택) - 빠른 테스트를 위한 서버 ID

## 2️⃣ 설치 및 실행 (2분)

```bash
# 의존성 설치
npm install

# 명령어 등록
npm run deploy:commands

# 봇 실행
npm start
```

## 3️⃣ 디스코드에서 설정 (3분)

### 봇 역할 위치 조정
서버 설정 → 역할 → 봇 역할을 관리할 역할들 위로 이동

### 자동 역할 설정
```
/자동역할 설정 역할:@멤버
```

### 역할 선택 UI 생성
```
/역할선택 시작
```

## ✅ 완료!

이제 다음 명령어들을 사용할 수 있습니다:

| 명령어 | 설명 |
|--------|------|
| `/도움말` | 전체 명령어 보기 |
| `/관리자패널` | 관리 인터페이스 |
| `/서버정보` | 서버 통계 확인 |

---

더 자세한 설정은 [SETUP.md](SETUP.md)를 참조하세요.
