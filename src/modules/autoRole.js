import { getConfig, setConfig } from '../storage/configStore.js';
import { logAction } from '../storage/logStore.js';
import * as logger from '../utils/logger.js';

/**
 * 자동 역할 모듈
 */

const AUTO_ROLE_KEY = 'autoRoles';
const EXCLUDED_ROLES_KEY = 'excludedAdminRoles';

export function getAutoRoles() {
  return getConfig(AUTO_ROLE_KEY) || [];
}

export function setAutoRoles(roles) {
  setConfig(AUTO_ROLE_KEY, roles);
}

export function getExcludedRoles() {
  return getConfig(EXCLUDED_ROLES_KEY) || [];
}

export function setExcludedRoles(roles) {
  setConfig(EXCLUDED_ROLES_KEY, roles);
}

export function addAutoRole(roleId, actorId) {
  const roles = getAutoRoles();
  if (!roles.includes(roleId)) {
    roles.push(roleId);
    setAutoRoles(roles);
    logAction('autorole_add', `역할 ID: ${roleId}`, actorId);
    return true;
  }
  return false;
}

export function removeAutoRole(roleId, actorId) {
  const roles = getAutoRoles();
  const index = roles.indexOf(roleId);
  if (index > -1) {
    roles.splice(index, 1);
    setAutoRoles(roles);
    logAction('autorole_remove', `역할 ID: ${roleId}`, actorId);
    return true;
  }
  return false;
}

/**
 * 새 멤버에게 자동 역할 부여
 */
export async function assignAutoRoles(member) {
  try {
    const roleIds = getAutoRoles();
    const excludedRoles = getExcludedRoles();
    
    // 관리자 역할이 있는지 확인
    const hasAdminRole = member.roles.cache.some(role => 
      excludedRoles.includes(role.id) || role.permissions.has('Administrator')
    );
    
    if (hasAdminRole) {
      logger.info(`관리자 역할을 가진 유저는 자동 역할 부여 제외: ${member.user.tag}`);
      return;
    }
    
    for (const roleId of roleIds) {
      const role = member.guild.roles.cache.get(roleId);
      if (role && !member.roles.cache.has(roleId)) {
        await member.roles.add(role);
        logger.info(`자동 역할 부여: ${member.user.tag} → ${role.name}`);
      }
    }
  } catch (error) {
    logger.error('자동 역할 부여 중 오류:', error);
  }
}
