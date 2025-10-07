import { getDb } from './database.js';

const selectStmt = () => getDb().prepare('SELECT value FROM config WHERE key = ?');
const upsertStmt = () => getDb().prepare('INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)');

export function getConfig(key) {
  const row = selectStmt().get(key);
  return row ? JSON.parse(row.value) : null;
}

export function setConfig(key, value) {
  upsertStmt().run(key, JSON.stringify(value));
}
