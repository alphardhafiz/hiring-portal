import React from "react";

interface LabelInputProps {
  isRequire?: boolean;
  title: string;
}

function LabelInput({ isRequire = false, title }: LabelInputProps) {
  return (
    <label className="block text-sm font-medium text-gray-700 mb-1 relative">
      {title}
      {isRequire && (
        <span className="text-red-500 text-[18px] absolute">*</span>
      )}
    </label>
  );
}

export default LabelInput;
