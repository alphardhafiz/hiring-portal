"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import countries from "@/data/coutry-code.json";

interface CustomPhoneInputProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CustomPhoneInput({
  name,
  value,
  onChange,
}: CustomPhoneInputProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);

  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (country: any) => {
    setSelectedCountry(country);
    setOpen(false);
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center border-2 border-[#E0E0E0] rounded-lg focus-within:border-[#01959F]">
        {/* Selector bendera */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50"
        >
          <span className="text-xl">{selectedCountry.emoji}</span>
          <ChevronDown size={18} className="text-gray-500" />
        </button>

        {/* Prefix */}
        <span className="text-gray-600">{selectedCountry.dial_code}</span>

        {/* Input */}
        <input
          type="tel"
          name={name}
          value={value}
          onChange={(e) => {
            const newValue = `${selectedCountry.dial_code}${e.target.value}`;
            const event = {
              ...e,
              target: {
                ...e.target,
                name,
                value: newValue,
              },
            } as React.ChangeEvent<HTMLInputElement>;
            onChange(event);
          }}
          placeholder="81XXXXXXXXX"
          className="flex-1 px-3 py-2 focus:outline-none"
        />
      </div>

      {/* Popup dropdown */}
      {open && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          <div className="p-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
            />
          </div>
          <ul className="max-h-56 overflow-y-auto">
            {filteredCountries.map((country) => (
              <li
                key={country.code}
                onClick={() => handleSelect(country)}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <span className="text-xl">{country.emoji}</span>
                <span className="flex-1">{country.name}</span>
                <span className="text-gray-500">{country.dial_code}</span>
              </li>
            ))}
            {filteredCountries.length === 0 && (
              <li className="px-4 py-2 text-gray-500 text-sm">
                No countries found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
