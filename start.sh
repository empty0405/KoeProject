#!/bin/bash

# KOE PROJECT 봇 시작 스크립트
echo "🚀 KOE PROJECT 봇을 시작합니다..."

# .env 파일 존재 확인
if [ ! -f .env ]; then
    echo "❌ .env 파일이 없습니다!"
    echo "📝 .env.example 파일을 복사하여 .env 파일을 만들고 봇 토큰을 설정해주세요."
    echo "   cp .env.example .env"
    exit 1
fi

# Node.js 버전 확인
NODE_VERSION=$(node --version)
echo "📋 Node.js 버전: $NODE_VERSION"

# 의존성 설치 확인
if [ ! -d "node_modules" ]; then
    echo "📦 의존성을 설치합니다..."
    npm install
fi

# 봇 실행
echo "🤖 봇을 실행합니다..."
node bot.js