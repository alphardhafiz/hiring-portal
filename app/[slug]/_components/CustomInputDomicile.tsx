import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import citiesJson from "@/data/cities.json";

// Type definitions
interface Province {
  provinsi: string;
  kota: string[];
}

interface CustomInputDomicileProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  isRequire?: boolean;
  placeholder?: string;
}

// Sample data - ganti dengan import JSON Anda
const citiesData: Province[] = citiesJson;

export default function CustomInputDomicile({
  name,
  value,
  onChange,
  disabled = false,
  isRequire = false,
  placeholder = "Ex. Jakarta, Indonesia",
}: CustomInputDomicileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || "");
  const [filteredData, setFilteredData] = useState<
    { provinsi: string; kota: string }[]
  >([]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Flatten cities data with province info
  const allCities = citiesData.flatMap((province) =>
    province.kota.map((kota) => ({
      provinsi: province.provinsi,
      kota: kota,
    }))
  );

  useEffect(() => {
    setSearchTerm(value || "");
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onChange(e);

    // Filter cities based on input
    const filtered = allCities.filter(
      (item) =>
        item.kota.toLowerCase().includes(value.toLowerCase()) ||
        item.provinsi.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
    setIsOpen(true);
  };

  const handleCitySelect = (city: string) => {
    setSearchTerm(city);

    // Create synthetic event to work with handleChange
    const syntheticEvent = {
      target: {
        name: name,
        value: city,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    onChange(syntheticEvent);
    setIsOpen(false);
  };

  const handleInputClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setFilteredData(allCities);
    }
  };

  const handleChevronClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setFilteredData(allCities);
      inputRef.current?.focus();
    }
  };

  return (
    <div ref={wrapperRef}>
      <div className="relative">
        <input
          ref={inputRef}
          autoComplete="off"
          disabled={disabled}
          type="text"
          name={name}
          value={searchTerm}
          onChange={handleInputChange}
          onClick={handleInputClick}
          placeholder={placeholder}
          className={`w-full px-4 py-2 pr-10 border-2 border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#01959F] ${
            disabled ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
        />

        <button
          type="button"
          onClick={handleChevronClick}
          disabled={disabled}
          className={`absolute right-3 top-1/2 -translate-y-1/2 ${
            disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          }`}
        >
          <ChevronDown
            className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-10 w-full mt-1 bg-white border-2 border-[#E0E0E0] rounded-lg shadow-lg max-h-60 overflow-y-auto scrollbar-hide">
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <div
                key={index}
                onClick={() => handleCitySelect(item.kota)}
                className="px-4 py-2 hover:bg-[#01959F] hover:text-white cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-b-0"
              >
                <div className="font-bold">
                  {item.kota} - {item.provinsi}
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500 text-center">
              No cities found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
