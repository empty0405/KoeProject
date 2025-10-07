/**
 * 시간 문자열 파싱 유틸리티
 * 예: "10m", "2h", "1d" → 밀리초
 */
export function parseDuration(str) {
  const match = str.match(/^(\d+)([smhd])$/);
  if (!match) return null;
  
  const value = parseInt(match[1]);
  const unit = match[2];
  
  switch (unit) {
    case 's': return value * 1000;
    case 'm': return value * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    case 'd': return value * 24 * 60 * 60 * 1000;
    default: return null;
  }
}

/**
 * 밀리초를 읽기 쉬운 형태로 변환
 */
export function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}일`;
  if (hours > 0) return `${hours}시간`;
  if (minutes > 0) return `${minutes}분`;
  return `${seconds}초`;
}

/**
 * 권한 확인 유틸리티
 */
export function hasStaffPermission(member) {
  return member.permissions.has('ManageMessages') || 
         member.permissions.has('ModerateMembers');
}

export function hasAdminPermission(member) {
  return member.permissions.has('Administrator') ||
         member.permissions.has('ManageGuild');
}
