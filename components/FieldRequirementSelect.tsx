import { useState } from "react";

interface FieldRequirementSelectProps {
  label: string;
  defaultValue?: string;
  disabledOptions?: string[];
  borderBottom?: boolean;
  onChange?: (value: string) => void;
}

export default function FieldRequirementSelect({
  label,
  defaultValue = "MANDATORY",
  borderBottom = false,
  disabledOptions = [],

  onChange,
}: FieldRequirementSelectProps) {
  const [selected, setSelected] = useState(defaultValue);

  const options = [
    { label: "Mandatory", value: "MANDATORY" },
    { label: "Optional", value: "OPTIONAL" },
    { label: "Off", value: "OFF" },
  ];

  const handleSelect = (value: string) => {
    if (disabledOptions.includes(value)) return;
    setSelected(value);
    onChange?.(value);
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <p className="mb-2 text-sm font-medium text-gray-800">{label}</p>
        <div className="flex gap-2">
          {options.map((opt) => {
            const isSelected = selected === opt.value;
            const isDisabled = disabledOptions.includes(opt.value);

            return (
              <button
                key={opt.value}
                type="button"
                disabled={isDisabled}
                onClick={() => handleSelect(opt.value)}
                className={`px-4 py-2 text-[14px] rounded-2xl border-2 text-sm font-medium transition-all
                ${
                  isDisabled
                    ? "border-[#E0E0E0] text-[#9E9E9E] bg-[#EDEDED] cursor-not-allowed"
                    : isSelected
                    ? "border-[#01959F] text-[#01959F] bg-white"
                    : "border-[#E0E0E0] text-gray-700 bg-white hover:border-[#01959F]/50"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
      {borderBottom && <div className="my-4 border border-[#E0E0E0]" />}
    </>
  );
}
