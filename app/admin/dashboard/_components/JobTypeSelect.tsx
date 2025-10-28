import { useState } from "react";
import { ChevronDown } from "lucide-react";
import LabelInput from "@/components/LabelInput";

interface JobTypeSelectProps {
  value: string;
  onChange: (name: string, value: string) => void;
}

export default function JobTypeSelect({ value, onChange }: JobTypeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    "FULL_TIME",
    "CONTRACT",
    "PART_TIME",
    "INTERNSHIP",
    "FREELANCE",
  ];

  const handleSelect = (val: string) => {
    onChange("jobType", val);
    setIsOpen(false);
  };

  const formattedValue = value
    ? value.toLowerCase().replace("_", " ").replace(/\b\w/g, (char) => char.toUpperCase())
    : "";

  return (
    <div className="relative w-full">
      <LabelInput isRequire title="Job Type" />

      <div
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <input
          type="text"
          name="jobType"
          readOnly
          value={formattedValue}
          placeholder="Select job type"
          className="w-full px-4 py-2 pr-10 border-2 border-[#E0E0E0] rounded-lg focus:outline-none cursor-pointer"
        />

        <ChevronDown
          className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          size={20}
        />
      </div>

      {isOpen && (
        <ul className="absolute z-10 w-full mt-1 bg-white border-2 border-[#E0E0E0] rounded-lg shadow-md">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => handleSelect(option)}
              className={`px-4 py-2 hover:bg-blue-100 cursor-pointer text-gray-700 ${
                option === value ? "bg-blue-50 font-semibold" : ""
              }`}
            >
              {option
                .toLowerCase()
                .replace("_", " ")
                .replace(/\b\w/g, (char) => char.toUpperCase())}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
