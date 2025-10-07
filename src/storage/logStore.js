import { getDb } from './database.js';

export function logAction(type, detail, actor, target = null) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO logs (type, detail, actor, target)
    VALUES (?, ?, ?, ?)
  `);
  stmt.run(type, detail, actor, target);
}

export function getRecentLogs(limit = 50) {
  const db = getDb();
  const stmt = db.prepare(`
    SELECT * FROM logs
    ORDER BY timestamp DESC
    LIMIT ?
  `);
  return stmt.all(limit);
}
