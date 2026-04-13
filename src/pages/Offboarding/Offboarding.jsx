import { useEffect, useState } from "react";
import ToggleType from "../../components/Form/ToggleType";
import OffboardingCard from "../../components/Cards/OffboardingCard";
import SearchBar from "../../components/UI/SearchBar";
import { caseService, employeeService } from "../../Api";
import "./Offboarding.css";

const COMPANY_ENUM = {
  unknown: 0,
  finansia: 1,
  agency: 2,
};

const getCompanyValue = (company) => {
  if (typeof company === "number") return company;
  if (typeof company !== "string") return 0;

  const normalized = company.toLowerCase();
  return COMPANY_ENUM[normalized] ?? 0;
};

const getCompanyLabel = (company) => {
  if (typeof company === "string") return company;
  if (company === 1) return "Finansia";
  if (company === 2) return "Agency";
  return "Unknown";
};

const extractList = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.items)) return response.items;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.$values)) return response.$values;
  if (Array.isArray(response?.value)) return response.value;
  return [];
};

const extractArrayValue = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.$values)) return value.$values;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.value)) return value.value;
  return [];
};

const readField = (obj, camelKey, pascalKey, fallback = "") => {
  const value = obj?.[camelKey] ?? obj?.[pascalKey];
  return value ?? fallback;
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
    systemAccessId: rawId,
    name,
    status: account?.status ?? 0,
  };
};

const normalizeAccounts = (user) => {
  const rawAccounts =
    readField(user, "accounts", "Accounts", null) ??
    readField(user, "systemAccesses", "SystemAccesses", null) ??
    readField(user, "accesses", "Accesses", null) ??
    [];

  return extractArrayValue(rawAccounts)
    .map(normalizeAccount)
    .filter((account) => account.systemAccessId != null || Boolean(account.name));
};

const toAccountPayload = (account) => {
  const rawId = account?.systemAccessId ?? account?.id ?? account?.systemId ?? null;
  if (rawId === null || rawId === undefined) return null;

  const asString = String(rawId).trim();
  if (!asString) return null;

  const numeric = Number(asString);
  return {
    systemAccessId: Number.isFinite(numeric) ? numeric : asString,
    status: 0,
  };
};

const normalizeUser = (user) => {
  const firstName = readField(user, "firstName", "FirstName", "");
  const lastName = readField(user, "lastName", "LastName", "");
  const fullName = `${firstName} ${lastName}`.trim() || readField(user, "name", "Name", "Okänd användare");
  const accounts = normalizeAccounts(user);
  const fallbackCount = Number(readField(user, "systemAccessCount", "SystemAccessCount", 0)) || 0;

  return {
    id: readField(user, "id", "Id", readField(user, "userId", "UserId", null)),
    firstName,
    lastName,
    name: fullName,
    title: readField(user, "title", "Title", "-"),
    personalId: readField(user, "personalId", "PersonalId", ""),
    phoneNumber: readField(user, "phoneNumber", "PhoneNumber", readField(user, "mobileNumber", "MobileNumber", "")),
    company: getCompanyLabel(readField(user, "company", "Company", 0)),
    companyValue: getCompanyValue(readField(user, "company", "Company", 0)),
    department: readField(user, "department", "Department", "-"),
    startDate: readField(user, "startDate", "StartDate", null),
    dateOfEmployment: readField(user, "dateOfEmployment", "DateOfEmployment", readField(user, "startDate", "StartDate", null)),
    accounts,
    systemAccessCount: accounts.length || fallbackCount,
  };
};

function Offboarding() {
  const [type, setType] = useState("offboarding");
  const [query, setQuery] = useState("");
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!successMessage) return undefined;

    const timerId = setTimeout(() => {
      setSuccessMessage("");
    }, 5000);

    return () => clearTimeout(timerId);
  }, [successMessage]);

  useEffect(() => {
    if (!errorMessage) return undefined;

    const timerId = setTimeout(() => {
      setErrorMessage("");
    }, 5000);

    return () => clearTimeout(timerId);
  }, [errorMessage]);

  useEffect(() => {
    let isMounted = true;

    const loadEmployees = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const employeeResponse = await employeeService.getAllEmployees();
        if (!isMounted) return;

        const sourceList = extractList(employeeResponse);
        console.log('Raw employee list from API:', sourceList.length, 'items');

        const normalized = sourceList
          .map(normalizeUser)
          .filter((user) => user.id != null);

        console.log('After normalization:', normalized.length, 'items');

        // Deduplicate by ID to prevent showing same employee multiple times
        const seenIds = new Set();
        const deduplicated = normalized.filter((user) => {
          if (seenIds.has(user.id)) {
            console.warn(`Duplicate employee detected: ${user.name} (ID: ${user.id})`);
            return false;
          }
          seenIds.add(user.id);
          return true;
        });

        console.log('After deduplication:', deduplicated.length, 'items');

        setEmployees(deduplicated);

        if (!deduplicated.length) {
          setErrorMessage("Inga anställda hittades för offboarding");
        }
      } catch (error) {
        if (!isMounted) return;
        setErrorMessage(error.message || "Kunde inte hämta anställda");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadEmployees();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreateOffboardingCase = async (user, endDate) => {
    if (isCreating) return;

    setErrorMessage("");
    setSuccessMessage("");
    setIsCreating(true);

    try {
      const casePayload = {
        employee: {
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          title: user.title || "",
          personalId: user.personalId || "",
          phoneNumber: user.phoneNumber || "",
          company: user.companyValue ?? 0,
          department: user.department || "",
          startDate: user.startDate || new Date().toISOString(),
          endDate: endDate ? new Date(`${endDate}T00:00:00`).toISOString() : null,
          dateOfEmployment: user.dateOfEmployment || user.startDate || new Date().toISOString(),
          accounts: (Array.isArray(user.accounts) ? user.accounts : [])
            .map(toAccountPayload)
            .filter((item) => item !== null),
        },
        type: 2,
        status: 1,
        createdByUser: 0,
      };

      console.log('Offboarding case payload:', casePayload);
      console.log('Number of accounts in payload:', casePayload.employee.accounts.length);

      await caseService.createCase(casePayload);
      setSuccessMessage("Ärende skapad framgångsrikt");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error('Error creating offboarding case:', error);
      setErrorMessage(error.message || "Kunde inte skapa offboarding-ärende");
    } finally {
      setIsCreating(false);
    }
  };

  const filteredEmployees = employees.filter((e) =>
    e.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <div className="page-title">
        <i className="fa-solid fa-user-minus users-icon" />
        <h2 className="form-title">Offboarding – Anställda</h2>
      </div>

      <div className="form-wrapper">
        <ToggleType type={type} setType={setType} />

        <SearchBar value={query} onChange={setQuery} />

        {successMessage && (
          <div style={{
            padding: "1rem",
            backgroundColor: "#d4edda",
            color: "#155724",
            borderRadius: "4px",
            marginBottom: "1rem",
          }}>
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div style={{
            padding: "1rem",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            borderRadius: "4px",
            marginBottom: "1rem",
          }}>
            {errorMessage}
          </div>
        )}

        {isLoading && <p>Laddar anställda...</p>}

        {!isLoading && filteredEmployees.map((employee) => (
          <OffboardingCard
            key={employee.id}
            employee={employee}
            onConfirmOffboarding={handleCreateOffboardingCase}
            onError={() => setErrorMessage("Kunde inte skapa case")}
          />
        ))}
      </div>
    </>
  );
}

export default Offboarding;
