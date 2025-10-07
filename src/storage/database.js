import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let db = null;

function init() {
  const dataDir = path.join(__dirname, '../../data');
  
  // 데이터 디렉토리가 없으면 생성
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    logger.info('데이터 디렉토리 생성됨: ' + dataDir);
  }

  const dbPath = path.join(dataDir, 'jellyguard.db');
  db = new Database(dbPath);
  
  // WAL 모드 활성화 (동시성 향상)
  db.pragma('journal_mode = WAL');
  
  // 테이블 생성
  db.exec(`
    CREATE TABLE IF NOT EXISTS config (
      key TEXT PRIMARY KEY,
      value TEXT
    );
    
    CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      type TEXT,
      detail TEXT,
      actor TEXT,
      target TEXT
    );
    
    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      reporter_id TEXT,
      reported_id TEXT,
      reason TEXT,
      status TEXT DEFAULT 'open',
      guild_id TEXT,
      channel_id TEXT
    );
    
    CREATE TABLE IF NOT EXISTS warnings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      user_id TEXT,
      moderator_id TEXT,
      reason TEXT,
      guild_id TEXT
    );
    
    CREATE TABLE IF NOT EXISTS punishments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      user_id TEXT,
      moderator_id TEXT,
      type TEXT,
      duration TEXT,
      reason TEXT,
      guild_id TEXT
    );
    
    CREATE TABLE IF NOT EXISTS templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE,
      data TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      guild_id TEXT
    );
  `);
  
  logger.success('데이터베이스 초기화 완료');
}

export function getDb() {
  if (!db) {
    init();
  }
  return db;
}
