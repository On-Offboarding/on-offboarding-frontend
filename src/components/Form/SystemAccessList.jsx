import { useState } from "react";

const systems = [
  "Office 365", "CreditSafe", "UC", "Coface", "Allianz", "HubSpot",
  "Scrive","Metabase", "Zapier","Databox", "Ekopost", "Keeros", "Nord Corp.Netbank",
  "Finansia App", "Fortnox Integration", "Fortnox", "Rival(AgeraPay)", "Google Ads",
  "Facebook Page", "Instagram Business", "Zendesk","Intercom", "Tellit Växel/Telefoni",
  "Bria Teams", "Tellit Tech (Telefoni)"
];

function SystemAccessList({ accesses, setAccesses, profiles }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState("");
  // Default profiles for development — you can pass real `profiles` prop later
  const defaultProfiles = {
    "Säljare": ["Office 365", "Tellit Tech (Telefoni)", "Callmaker", "Bria Teams"],
    "Handläggare": [
      "Office 365",
      "Tellit Växel/Telefoni",
      "Intercom",
      "Coface",
      "CreditSafe",
      "Allianz",
      "Keeros",
      "Zendesk",
      "KÄK",
      "Ekopost",
    ],
    "Inkassohandläggare": ["Office 365", "Rival(AgeraPay)", "Tellit Växel/Telefoni"],
  };

  const profileMap = profiles || defaultProfiles;

  const handleProfileSelect = (key) => {
    setSelectedProfile(key);
    setIsDropdownOpen(false);
    if (!key) return setAccesses([]);
    const mapped = (profileMap[key] || []).filter((s) => systems.includes(s));
    setAccesses(mapped);
  };

  const toggleAll = (e) => {
    e.preventDefault();
    if (accesses.length === systems.length) {
      setAccesses([]);
    } else {
      setAccesses(systems);
    }
  };

  const toggleOne = (item) => {
    if (accesses.includes(item)) {
      setAccesses(accesses.filter(x => x !== item));
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
              className="profile-dropdown-trigger"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-haspopup="listbox"
              aria-expanded={isDropdownOpen}
            >
              <span className="dropdown-text">
                {selectedProfile ? selectedProfile : "Välj profil..."}
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
                    onClick={() => handleProfileSelect("")}
                    role="option"
                    aria-selected={!selectedProfile}
                  >
                    Välj profil...
                  </span>
                </li>
                {Object.keys(profileMap).map((p) => (
                  <li key={p}>
                    <span
                      className={`profile-option ${selectedProfile === p ? "selected" : ""}`}
                      onClick={() => handleProfileSelect(p)}
                      role="option"
                      aria-selected={selectedProfile === p}
                    >
                      {p}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button type="button" className="mark-all" onClick={toggleAll}>
            {accesses.length === systems.length ? "Avmarkera alla" : "Markera alla"}
          </button>
        </div>
      </div>

      <div className="system-list">
        {systems.map((sys) => (
          <label key={sys} className="checkbox-item">
            <input type="checkbox" checked={accesses.includes(sys)} onChange={() => toggleOne(sys)} />
            {sys}
          </label>
        ))}
      </div>
    </div>
  );
}

export default SystemAccessList;
