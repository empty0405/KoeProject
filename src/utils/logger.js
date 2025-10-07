/**
 * 간단한 로거 유틸리티
 */

function timestamp() {
  const now = new Date();
  return now.toISOString().replace('T', ' ').substring(0, 19);
}

export function info(message) {
  console.log(`[INFO ${timestamp()}] ${message}`);
}

export function warn(message) {
  console.warn(`[WARN ${timestamp()}] ${message}`);
}

export function error(message, err) {
  console.error(`[ERROR ${timestamp()}] ${message}`, err || '');
}

export function success(message) {
  console.log(`[SUCCESS ${timestamp()}] ✅ ${message}`);
}
