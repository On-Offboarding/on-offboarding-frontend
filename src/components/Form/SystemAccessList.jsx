const systems = [
  "Office 365", "CreditSafe", "UC", "Coface", "Allianz", "HubSpot",
  "Scrive","Metabase", "Zapier","Databox", "Ekopost", "Keeros", "Nord Corp.Netbank",
  "Finansia App", "Fortnox Integration", "Fortnox", "Rival(AgeraPay)", "Google Ads",
  "Facebook Page", "Instagram Business", "Zendesk","Intercom", "Tellit Växel/Telefoni",
  "Bria Teams", "Tellit Tech (Telefoni)"
];

function SystemAccessList({ accesses, setAccesses }) {
  const toggleAll = () => {
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
        <button className="mark-all" onClick={toggleAll}>
          {accesses.length === systems.length ? "Avmarkera alla" : "Markera alla"}
        </button>
      </div>

      <div className="grid-3">
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
