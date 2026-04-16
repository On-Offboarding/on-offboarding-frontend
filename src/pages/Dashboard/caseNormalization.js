import { getCompanyLabel } from "../../utils/company";

const STATUS_MAP = {
  0: "pending",
  1: "pending",
  2: "in-progress",
  3: "completed",
};

const TYPE_MAP = {
  0: "unknown",
  1: "onboarding",
  2: "offboarding",
};

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toISOString().split("T")[0];
};

const normalizeStatus = (status) => {
  if (typeof status === "number") return STATUS_MAP[status] || "pending";

  const normalized = String(status || "").toLowerCase();
  if (["created", "pending", "none", "väntande", "vantar", "väntar"].includes(normalized)) {
    return "pending";
  }
  if (["ongoing", "in-progress", "pågående", "pagaende"].includes(normalized)) {
    return "in-progress";
  }
  if (["completed", "klar", "slutförd", "slutford"].includes(normalized)) {
    return "completed";
  }

  return "pending";
};

const normalizeType = (type) => {
  if (typeof type === "number") return TYPE_MAP[type] || "unknown";

  const normalized = String(type || "").toLowerCase();
  if (["onboarding", "onboard"].includes(normalized)) return "onboarding";
  if (["offboarding", "offboard"].includes(normalized)) return "offboarding";

  return "unknown";
};

const normalizeCompany = (company) => {
  return getCompanyLabel(company);
};

const getSystemId = (system) => {
  if (typeof system === "string") return null;
  return system?.id ?? system?.systemAccessId ?? system?.systemId ?? null;
};

const getSystemName = (system) => {
  if (typeof system === "string") return system;
  return system?.name || system?.systemName || system?.title || "";
};

export const normalizeSystem = (system) => ({
  ...(typeof system === "object" && system ? system : {}),
  id: getSystemId(system),
  name: getSystemName(system),
});

const getProfileId = (profile) => profile?.id || profile?.profileId || profile?.value;

const getProfileName = (profile) =>
  profile?.name || profile?.profileName || profile?.title || String(getProfileId(profile) || "");

const getSystemsFromProfile = (profile) => {
  const rawSystems =
    profile?.systems ||
    profile?.systemAccesses ||
    profile?.accesses ||
    profile?.accounts ||
    [];

  if (!Array.isArray(rawSystems)) return [];

  return rawSystems
    .map((item) => normalizeSystem(item?.systemAccess || item?.system || item))
    .filter((system) => Boolean(system.name));
};

const profileRelationMatches = (relationItem, profileId) => {
  if (!relationItem) return false;

  if (typeof relationItem === "number" || typeof relationItem === "string") {
    return String(relationItem) === String(profileId);
  }

  const relationId = relationItem?.id ?? relationItem?.profileId ?? relationItem?.value;
  return relationId != null && String(relationId) === String(profileId);
};

const getSystemsForProfileFromCatalog = (allSystems, profileId) => {
  if (!profileId || !Array.isArray(allSystems)) return [];

  return allSystems.filter((system) => {
    const directProfileId = system?.profileId ?? system?.profile?.id;
    if (directProfileId != null && String(directProfileId) === String(profileId)) {
      return true;
    }

    if (Array.isArray(system?.profileIds) && system.profileIds.some((id) => String(id) === String(profileId))) {
      return true;
    }

    if (typeof system?.profileIds === "string") {
      const parsedIds = system.profileIds
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean);
      if (parsedIds.some((id) => String(id) === String(profileId))) {
        return true;
      }
    }

    if (Array.isArray(system?.profiles) && system.profiles.some((item) => profileRelationMatches(item, profileId))) {
      return true;
    }

    return false;
  });
};

const isSameSystem = (a, b) => {
  if (a?.id != null && b?.id != null) {
    return String(a.id) === String(b.id);
  }
  return a?.name === b?.name;
};

const extractArrayValue = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.$values)) return value.$values;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.value)) return value.value;
  return [];
};

const normalizeAccount = (account) => {
  const candidate = account?.systemAccess || account?.system || account;
  const rawId =
    candidate?.id ??
    candidate?.systemAccessId ??
    candidate?.systemId ??
    account?.systemAccessId ??
    account?.systemId ??
    null;
  const name =
    candidate?.name ||
    candidate?.systemName ||
    candidate?.title ||
    account?.name ||
    account?.systemName ||
    "";

  return {
    id: rawId,
    systemAccessId: rawId,
    name,
    status: account?.status ?? 0,
  };
};

const resolveSelectedProfile = (accounts, profiles, systems, explicitProfile) => {
  if (explicitProfile) {
    return {
      id: getProfileId(explicitProfile),
      name: getProfileName(explicitProfile),
      raw: explicitProfile,
    };
  }

  if (!Array.isArray(accounts) || !accounts.length || !Array.isArray(profiles) || !profiles.length) {
    return null;
  }

  const normalizedAccounts = accounts
    .map(normalizeAccount)
    .filter((account) => account.id != null || Boolean(account.name));

  if (!normalizedAccounts.length) return null;

  const rankedProfiles = profiles
    .map((profile) => {
      const profileId = getProfileId(profile);
      const profileSystems = getSystemsFromProfile(profile).length
        ? getSystemsFromProfile(profile)
        : getSystemsForProfileFromCatalog(systems, profileId);
      const matchedSystems = profileSystems.filter((profileSystem) =>
        normalizedAccounts.some((account) => isSameSystem(account, profileSystem))
      );

      return {
        profile,
        score: matchedSystems.length,
        totalSystems: profileSystems.length,
      };
    })
    .filter((item) => item.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      return left.totalSystems - right.totalSystems;
    });

  const bestMatch = rankedProfiles[0]?.profile;
  if (!bestMatch) return null;

  return {
    id: getProfileId(bestMatch),
    name: getProfileName(bestMatch),
    raw: bestMatch,
  };
};

export const normalizeCase = (caseItem, profiles = [], systems = []) => {
  const employee = caseItem?.employee || {};
  const firstName = employee.firstName || caseItem.firstName || "";
  const lastName = employee.lastName || caseItem.lastName || "";
  const rawAccounts = extractArrayValue(employee.accounts).length
    ? extractArrayValue(employee.accounts)
    : extractArrayValue(caseItem.accounts);
  const accounts = rawAccounts
    .map(normalizeAccount)
    .filter((account) => account.id != null || Boolean(account.name));
  const explicitProfile = employee.profile || caseItem.profile || {
    id: employee.profileId ?? caseItem.profileId ?? null,
    name: employee.profileName || caseItem.profileName || "",
  };
  const selectedProfile = resolveSelectedProfile(
    accounts,
    profiles,
    systems,
    getProfileId(explicitProfile) || getProfileName(explicitProfile) ? explicitProfile : null,
  );

  return {
    ...caseItem,
    id: caseItem.id,
    firstName,
    lastName,
    name: `${firstName} ${lastName}`.trim() || caseItem.name || "Namnlös",
    personalId: employee.personalId || caseItem.personalId || "",
    phoneNumber: employee.phoneNumber || caseItem.phoneNumber || "",
    department: employee.department || caseItem.department || "-",
    title: employee.title || caseItem.title || "-",
    company: normalizeCompany(employee.company ?? caseItem.company),
    startDate: formatDate(employee.startDate || caseItem.startDate),
    endDate: formatDate(employee.endDate || caseItem.endDate),
    dateOfEmployment: formatDate(employee.dateOfEmployment || caseItem.dateOfEmployment),
    accounts,
    systemAccessCount: accounts.length || caseItem.systemAccessCount || 0,
    selectedProfile,
    selectedProfileName: selectedProfile?.name || "-",
    status: normalizeStatus(caseItem.status),
    type: normalizeType(caseItem.type),
  };
};