import { useState } from "react";
import ToggleType from "../../components/Form/ToggleType";
import OffboardingCard from "../../components/Cards/OffboardingCard";
import SearchBar from "../../components/UI/SearchBar";
import "./Offboarding.css";

function Offboarding() {
  const [type, setType] = useState("offboarding");
  const [query, setQuery] = useState("");

  // TEMP mock (ersätts av API senare)
  const employees = [
    {
      id: 1,
      name: "Alexander Isak",
      department: "IT",
      title: "Systemutvecklare",
      company: "Fantasia",
      startDate: "2025-12-12",
      systemAccessCount: 0,
    },
    {
      id: 2,
      name: "Sara Andersson",
      department: "HR",
      title: "HR Partner",
      company: "Fantasia",
      startDate: "2024-08-01",
      systemAccessCount: 3,
    },
  ];

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

        {filteredEmployees.map((employee) => (
          <OffboardingCard key={employee.id} employee={employee} />
        ))}
      </div>
    </>
  );
}

export default Offboarding;
