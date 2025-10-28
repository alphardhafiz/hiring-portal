"use client";

import { useState } from "react";
import { X } from "lucide-react";
import JobTypeSelect from "./JobTypeSelect";
import LabelInput from "@/components/LabelInput";
import AutoResizeTextarea from "@/components/AutoResizeTextArea";
import FieldRequirementSelect from "@/components/FieldRequirementSelect";
import formatRupiah from "@/utils/formatRupiah";

interface ModalCreateJobProps {
  isOpen: boolean;
  onClose: () => void;
}

function ModalCreateJob({ isOpen, onClose }: ModalCreateJobProps) {
  const [formData, setFormData] = useState({
    jobName: "",
    jobType: "",
    jobDescription: "",
    numOfCandidate: "",
    minSalary: "",
    maxSalary: "",
    fullName: "MANDATORY",
    photoProfile: "MANDATORY",
    gender: "OPTIONAL",
    domicile: "OPTIONAL",
    email: "MANDATORY",
    phoneNumber: "OPTIONAL",
    linkedin: "OFF",
    dateOfBirth: "OPTIONAL",
  });
  const [loading, setLoading] = useState(false);
  const handleChange = (
    eOrName: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string,
    maybeValue?: string
  ) => {
    if (typeof eOrName === "string") {
      setFormData((prev) => ({ ...prev, [eOrName]: maybeValue }));
    } else {
      const { name, value } = eOrName.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to create job");

      const result = await res.json();
      console.log("Success:", result);

      // reset form ke default
      setFormData({
        jobName: "",
        jobType: "",
        jobDescription: "",
        numOfCandidate: "",
        minSalary: "",
        maxSalary: "",
        fullName: "MANDATORY",
        photoProfile: "MANDATORY",
        gender: "OPTIONAL",
        domicile: "OPTIONAL",
        email: "MANDATORY",
        phoneNumber: "OPTIONAL",
        linkedin: "OFF",
        dateOfBirth: "OPTIONAL",
      });
      onClose()
    } catch (error) {
      console.error("Error creating job:", error);
    } finally {
      setLoading(false);
    }
  };

  // const formatRupiah = (value: string | number) => {
  //   if (value === "" || value === null) return "";
  //   const numberString = value.toString().replace(/\D/g, "");
  //   const formatted = new Intl.NumberFormat("id-ID").format(
  //     Number(numberString)
  //   );
  //   return formatted;
  // };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Hapus semua karakter non-digit biar bisa disimpan ke state
    const numericValue = value.replace(/\D/g, "");

    setFormData((prev) => ({
      ...prev,
      [name]: numericValue === "" ? "" : Number(numericValue),
    }));
  };

  const isFormValid = Object.entries(formData).every(([key, value]) => {
    // kalau value === "" -> gak valid
    if (value === "") return false;
    // selain itu, valid (termasuk 0)
    return true;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-lg w-[900px] z-10 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E0E0E0] p-6 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900">Job Opening</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body (scrollable) */}
        <div
          className="flex-1 overflow-y-auto p-6 space-y-4"
          style={{
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE/Edge
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none; /* Chrome, Safari, Opera */
            }
          `}</style>

          <div>
            <LabelInput isRequire title="Job Name" />
            <input
              type="text"
              name="jobName"
              value={formData.jobName}
              onChange={handleChange}
              placeholder="Ex. Front End Engineer"
              className="w-full px-4 py-2 border-2 border-[#E0E0E0] rounded-lg focus:outline-none"
            />
          </div>

          <JobTypeSelect value={formData.jobType} onChange={handleChange} />

          <div>
            <LabelInput isRequire title="Job Description" />

            <AutoResizeTextarea
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
            />
          </div>

          <div>
            <LabelInput isRequire title="Number of Candidate Needed" />
            <input
              type="number"
              name="numOfCandidate"
              value={formData.numOfCandidate}
              onChange={handleChange}
              placeholder="Ex. 2"
              className="w-full px-4 py-2 border-2 border-[#E0E0E0] rounded-lg focus:outline-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [appearance:textfield]"
            />
          </div>
          <div className="border-2 border-b border-dashed border-[#e0e0e0]" />

          <div className="mt-6">
            <p className="mb-4">Job Salary</p>
            <div className="flex justify-between gap-12">
              <div className="flex-1">
                <LabelInput title="Minimum Estimated Salary" />
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold">
                    Rp
                  </span>
                  <input
                    type="text"
                    name="minSalary"
                    value={formatRupiah(formData.minSalary)}
                    onChange={handleSalaryChange}
                    placeholder="7.000.000"
                    className="w-full pl-12 pr-4 py-2 border-2 border-[#E0E0E0] rounded-lg focus:outline-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [appearance:textfield]"
                  />
                </div>
              </div>
              <div className="flex-1">
                <LabelInput title="Maximum Estimated Salary" />
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold">
                    Rp
                  </span>
                  <input
                    type="text"
                    name="maxSalary"
                    value={formatRupiah(formData.maxSalary)}
                    onChange={handleSalaryChange}
                    placeholder="8.000.000"
                    className="w-full pl-12 pr-4 py-2 border-2 border-[#E0E0E0] rounded-lg focus:outline-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [appearance:textfield]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* section setting mandatory*/}
          <div className="p-4 border border-[#EDEDED] rounded-lg">
            <h1 className="font-bold text-[14px]">
              Minimum Profile Information Required
            </h1>
            <div className="mt-4 p-2">
              <FieldRequirementSelect
                label="Full Name"
                disabledOptions={["OPTIONAL", "OFF"]}
                borderBottom
              />

              <FieldRequirementSelect
                label="Photo Profile"
                disabledOptions={["OPTIONAL", "OFF"]}
                borderBottom
              />
              <FieldRequirementSelect label="Gender" borderBottom />
              <FieldRequirementSelect label="Domicile" borderBottom />
              <FieldRequirementSelect
                label="Email"
                disabledOptions={["OPTIONAL", "OFF"]}
                borderBottom
              />
              <FieldRequirementSelect label="Phone number" borderBottom />
              <FieldRequirementSelect label="Linkedin link" borderBottom />
              <FieldRequirementSelect label="Date of birth" />
            </div>
          </div>
        </div>

        {/* Footer (fixed) */}
        <div className="flex justify-end gap-3 p-6 border-t border-[#E0E0E0] flex-shrink-0">
          <button
            disabled={!isFormValid}
            onClick={handleSubmit}
            className="px-4 py-2 font-bold bg-[#01959F] border rounded-lg text-white disabled:border disabled:bg-[#EDEDED] disabled:border-[#E0E0E0] disabled:text-[#9E9E9E] transition"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l3 3-3 3v-4a8 8 0 01-8-8z"
                  ></path>
                </svg>
                Publishing...
              </span>
            ) : (
              "Create Job"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalCreateJob;
