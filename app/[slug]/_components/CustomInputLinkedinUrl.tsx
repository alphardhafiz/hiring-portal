"use client";

import { useState, useEffect } from "react";

interface CustomInputLinkedinUrlProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function CustomInputLinkedinUrl({
  name,
  value,
  onChange,
  disabled = false,
  placeholder = "Ex. https://linkedin.com/in/johndoe",
}: CustomInputLinkedinUrlProps) {
  const [urlStatus, setUrlStatus] = useState<"idle" | "checking" | "valid" | "invalid">("idle");

  // Validasi format LinkedIn URL
  const validateLinkedInUrl = (url: string) => {
    const linkedInPattern = /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/;
    return linkedInPattern.test(url);
  };

  // Atau gunakan function ini jika ingin cek via API
  const checkLinkedInUrlViaAPI = async (url: string) => {
    try {
      new URL(url);
    } catch {
      setUrlStatus("invalid");
      return;
    }

    setUrlStatus("checking");

    try {
      const response = await fetch("/api/check-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (data.exists) {
        setUrlStatus("valid");
      } else {
        setUrlStatus("invalid");
      }
    } catch (error) {
      setUrlStatus("invalid");
    }
  };

  // Debounce untuk validasi
  useEffect(() => {
    if (!value || value.trim() === "") {
      setUrlStatus("idle");
      return;
    }

    const timeoutId = setTimeout(() => {
      // Pilih salah satu: validasi pattern atau API
      // Opsi 1: Validasi pattern saja (lebih cepat)
      if (validateLinkedInUrl(value)) {
        setUrlStatus("valid");
      } else {
        setUrlStatus("invalid");
      }

      // Opsi 2: Cek via API (uncomment jika sudah ada endpoint)
      // checkLinkedInUrlViaAPI(value);
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [value]);

  return (
    <div className="w-full">
      <input
        disabled={disabled}
        type="url"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 border-2 border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#01959F] disabled:bg-gray-100 disabled:cursor-not-allowed"
      />

      {/* Status indicator */}
      {urlStatus === "checking" && (
        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
          <svg
            className="w-4 h-4 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Checking URL...</span>
        </div>
      )}

      {urlStatus === "valid" && (
        <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>URL address found</span>
        </div>
      )}

      {urlStatus === "invalid" && (
        <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <span>Invalid LinkedIn URL format</span>
        </div>
      )}
    </div>
  );
}