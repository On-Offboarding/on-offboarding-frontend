import { useEffect, useState } from "react";
import { systemAccessService } from "../../Api";

const getSystemId = (system) => {
  if (typeof system === "string") return null;
  return system?.id ?? system?.systemAccessId ?? system?.systemId ?? null;
};

const getSystemName = (system) => {
  if (typeof system === "string") return system;
  return system?.name || system?.systemName || system?.title || "";
};

const normalizeSystem = (system) => ({
  ...(typeof system === "object" && system ? system : {}),
  id: getSystemId(system),
  name: getSystemName(system),
});

const isSameSystem = (a, b) => {
  if (a?.id != null && b?.id != null) {
    return String(a.id) === String(b.id);
  }
  return a?.name === b?.name;
};

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
    .map((item) => {
      const candidate = item?.systemAccess || item?.system || item;
      return normalizeSystem(candidate);
    })
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

const toCanonicalSystems = (profileSystems, allSystems) => {
  if (!Array.isArray(profileSystems) || !Array.isArray(allSystems)) return [];

  return profileSystems
    .map((profileSystem) => {
      const byId = profileSystem?.id != null
        ? allSystems.find((candidate) => String(candidate.id) === String(profileSystem.id))
        : null;

      if (byId) return byId;

      const byName = profileSystem?.name
        ? allSystems.find((candidate) => candidate.name === profileSystem.name)
        : null;

      return byName || profileSystem;
    })
    .filter((system) => Boolean(system?.name));
};

function SystemAccessList({ accesses, setAccesses, initialSelectedProfile = null, readOnly = false }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(initialSelectedProfile || null);
  const [profiles, setProfiles] = useState([]);
  const [systems, setSystems] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setErrorMessage("");
        const [profilesResponse, systemsResponse] = await Promise.all([
          systemAccessService.getAllProfiles(),
          systemAccessService.getAllSystems(),
        ]);

        if (!isMounted) return;

        const loadedProfiles = Array.isArray(profilesResponse) ? profilesResponse : [];
        const loadedSystems = (Array.isArray(systemsResponse) ? systemsResponse : [])
          .map(normalizeSystem)
          .filter((system) => Boolean(system.name));

        setProfiles(loadedProfiles);
        setSystems(loadedSystems);
      } catch (error) {
        if (!isMounted) return;
        setErrorMessage(error.message || "Kunde inte hämta system/profiler");
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleProfileSelect = (profile) => {
    if (readOnly) return;

    setSelectedProfile(profile);
    setIsDropdownOpen(false);

    if (!profile) {
      setErrorMessage("");
      setAccesses([]);
      return;
    }

    const profileId = getProfileId(profile);
    if (!profileId) {
      setErrorMessage("");
      setAccesses([]);
      return;
    }

    const profileSystemsFromProfile = getSystemsFromProfile(profile);
    const profileSystemsFromCatalog = getSystemsForProfileFromCatalog(systems, profileId);

    const profileSystems = profileSystemsFromProfile.length
      ? toCanonicalSystems(profileSystemsFromProfile, systems)
      : profileSystemsFromCatalog;

    if (!profileSystems.length) {
      setErrorMessage("Profilen saknar kopplade system. Välj system manuellt.");
      setAccesses([]);
      return;
    }

    const systemsWithoutId = profileSystems.some((system) => system?.id == null);
    if (systemsWithoutId) {
      setErrorMessage("Vissa system saknar ID och kan därför inte sparas korrekt.");
    } else {
      setErrorMessage("");
    }

    setAccesses(profileSystems);
  };

  const toggleAll = (e) => {
    if (readOnly) return;
    e.preventDefault();
    if (!systems.length) return;

    if (accesses.length === systems.length) {
      setAccesses([]);
    } else {
      setAccesses(systems);
    }
  };

  const toggleOne = (item) => {
    if (readOnly) return;

    if (accesses.some((access) => isSameSystem(access, item))) {
      setAccesses(accesses.filter((access) => !isSameSystem(access, item)));
    } else {
      setAccesses([...accesses, item]);
    }
  };

  return (
    <div className="system-access">
      <div className="system-header">
        <h4>Systemåtkomster</h4>
        <div className="systemAccess-btn">
          <div className="profile-dropdown-wrapper">
            <button
              type="button"
              className="profile-dropdown-trigger"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-haspopup="listbox"
              aria-expanded={isDropdownOpen}
              disabled={readOnly}
            >
              <span className="dropdown-text">
                {selectedProfile ? getProfileName(selectedProfile) : "Välj profil..."}
              </span>
              <i 
                className={`fa-solid fa-chevron-down dropdown-icon ${isDropdownOpen ? "open" : ""}`}
                aria-hidden="true"
              />
            </button>

            {isDropdownOpen && (
              <ul className="profile-dropdown-menu" role="listbox">
                <li>
                  <span
                    className={`profile-option ${!selectedProfile ? "selected" : ""}`}
                    onClick={() => handleProfileSelect(null)}
                    role="option"
                    aria-selected={!selectedProfile}
                  >
                    Välj profil...
                  </span>
                </li>
                {profiles.map((profile) => {
                  const profileId = getProfileId(profile);
                  const profileName = getProfileName(profile);

                  return (
                  <li key={profileId || profileName}>
                    <span
                      className={`profile-option ${getProfileId(selectedProfile) === profileId ? "selected" : ""}`}
                      onClick={() => handleProfileSelect(profile)}
                      role="option"
                      aria-selected={getProfileId(selectedProfile) === profileId}
                    >
                      {profileName}
                    </span>
                  </li>
                );
                })}
              </ul>
            )}
          </div>
          {!readOnly && (
            <button type="button" className="mark-all" onClick={toggleAll}>
              {systems.length > 0 && accesses.length === systems.length ? "Avmarkera alla" : "Markera alla"}
            </button>
          )}
        </div>
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <div className="system-list">
        {systems.map((sys) => (
          <label key={sys.id ?? sys.name} className="checkbox-item">
            <input
              type="checkbox"
              checked={accesses.some((access) => isSameSystem(access, sys))}
              onChange={() => toggleOne(sys)}
              disabled={readOnly}
            />
            {sys.name}
          </label>
        ))}
      </div>
    </div>
  );
}

export default SystemAccessList;
