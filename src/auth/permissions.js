export const ROLES = {
  ADMIN: "admin",
  CHEF: "chef",
};

const normalizeRoleValue = (value) => {
  if (value === null || value === undefined) return null;

  const normalized = String(value).trim().toLowerCase();
  if (!normalized) return null;

  if (normalized.includes("admin")) return ROLES.ADMIN;
  if (normalized.includes("chef") || normalized.includes("manager")) return ROLES.CHEF;

  return normalized;
};

export const getUserRole = (user) => {
  if (!user) return null;

  const rawRole =
    user.role ??
    user.Role ??
    user.userRole ??
    user.UserRole ??
    user.roleName ??
    user.RoleName ??
    null;

  if (Array.isArray(rawRole)) {
    return normalizeRoleValue(rawRole[0]);
  }

  return normalizeRoleValue(rawRole);
};

export const hasRole = (user, role) => {
  const normalizedUserRole = getUserRole(user);
  return normalizedUserRole === normalizeRoleValue(role);
};

export const hasAnyRole = (user, roles = []) => {
  if (!Array.isArray(roles) || !roles.length) return true;
  return roles.some((role) => hasRole(user, role));
};

export const canViewAudit = (user) => hasRole(user, ROLES.ADMIN);
export const canCreateCases = (user) => hasRole(user, ROLES.CHEF);
export const canManageCases = (user) => hasRole(user, ROLES.ADMIN);