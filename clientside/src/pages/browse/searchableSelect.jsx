import React, { useState } from "react";
import "../../css/browsePage/browse.css";

const SearchableSelect = ({ options, value, onChange, placeholder }) => {
  const [search, setSearch] = useState("");

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dropdown">
      <input
        type="text"
        placeholder={`Search ${placeholder}`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="filter-select">
        {filteredOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchableSelect;
