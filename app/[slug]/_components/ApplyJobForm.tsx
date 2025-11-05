// app/jobs/[slug]/_components/ApplyJobForm.tsx
"use client";

import React, { useState } from "react";
import { Job } from "@prisma/client";
import { useRouter } from "next/navigation";
import ButtonBack from "./ButtonBack";
import LabelInput from "@/components/LabelInput";
import CustomDatePicker from "./CustomDatePicker";
import CustomInputDomicile from "./CustomInputDomicile";
import CustomPhoneInput from "./CustomPhoneInput";
import CustomInputLinkedinUrl from "./CustomInputLinkedinUrl";

interface ApplyJobFormProps {
  job: Job;
}

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  photoProfile: File | null;
  gender: "MALE" | "FEMALE" | "";
  domicile: string;
  linkedin: string;
  dateOfBirth: string;
}

export default function ApplyJobForm({ job }: ApplyJobFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    photoProfile: null,
    gender: "",
    domicile: "",
    linkedin: "",
    dateOfBirth: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      photoProfile: file,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("jobId", job.id.toString());
      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phoneNumber", formData.phoneNumber);

      if (formData.photoProfile) {
        formDataToSend.append("photoProfile", formData.photoProfile);
      }
      if (formData.gender) {
        formDataToSend.append("gender", formData.gender);
      }
      if (formData.domicile) {
        formDataToSend.append("domicile", formData.domicile);
      }
      if (formData.linkedin) {
        formDataToSend.append("linkedin", formData.linkedin);
      }
      if (formData.dateOfBirth) {
        formDataToSend.append("dateOfBirth", formData.dateOfBirth);
      }

      const response = await fetch("/api/applications", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        alert("Application submitted successfully!");
        router.push("/");
      } else {
        const error = await response.json();
        alert(
          error.message || "Failed to submit application. Please try again."
        );
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-screen flex flex-col">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto py-10 px-6">
        {/* Header */}
        <div className="flex justify-between mb-8">
          <div className="flex-1 flex items-center gap-4">
            <ButtonBack />
            <span className="font-bold text-[18px] text-[#1D1F20]">
              Apply {job.jobName} at Rakamin
            </span>
          </div>
          <div className="flex gap-1 items-start text-sm text-gray-600">
            <span className="text-red-500 text-[20px]">*</span>
            This field required to fill
          </div>
        </div>

        {/* Main Form */}
        <div className="space-y-6">
          {/* Photo Profile Upload */}
          <div>
            <LabelInput
              isRequire={job.photoProfile === "MANDATORY"}
              title="Photo Profile"
            />
            <input
              disabled={job.photoProfile === "OFF"}
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full px-4 py-2 border-2 border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#01959F] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#01959F] file:text-white hover:file:bg-[#017a82] cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-2">
              Supported formats: JPG, PNG (Max 2MB)
            </p>
            {formData.photoProfile && (
              <p className="text-sm text-green-600 mt-2">
                ✓ {formData.photoProfile.name}
              </p>
            )}
          </div>
          {/* Full Name */}
          <div>
            <LabelInput
              isRequire={job.fullName === "MANDATORY"}
              title="Full Name"
            />
            <input
              disabled={job.fullName === "OFF"}
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-2 border-2 border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#01959F]"
            />
          </div>
          {/* Date of Birth */}
          <div>
            <LabelInput
              isRequire={job.dateOfBirth === "MANDATORY"}
              title="Date of Birth"
            />
            <CustomDatePicker
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              disabled={job.dateOfBirth === "OFF"}
              isRequire={job.dateOfBirth === "MANDATORY"}
            />
          </div>

          {/* Gender */}
          <div>
            <LabelInput
              isRequire={job.gender === "MANDATORY"}
              title="Pronoun (gender)"
            />
            <div className="flex items-center gap-6 mt-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value="FEMALE"
                  disabled={job.gender === "OFF"}
                  checked={formData.gender === "FEMALE"}
                  onChange={handleChange}
                  className="accent-[#01959F] w-4 h-4"
                />
                <span>She/Her (Female)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value="MALE"
                  disabled={job.gender === "OFF"}
                  checked={formData.gender === "MALE"}
                  onChange={handleChange}
                  className="accent-[#01959F] w-4 h-4"
                />
                <span>He/Him (Male)</span>
              </label>
            </div>
          </div>

          {/* Domicile */}
          <div className="relative">
            <LabelInput
              isRequire={job.domicile === "MANDATORY"}
              title="Domicile"
            />
            <CustomInputDomicile
              name="domicile"
              value={formData.domicile}
              onChange={handleChange}
              isRequire={true}
              placeholder="Choose your domicile"
            />
          </div>

          {/* Phone Number */}
          <div>
            <LabelInput
              isRequire={job.phoneNumber === "MANDATORY"}
              title="Phone Number"
            />
            <CustomPhoneInput
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div>
            <LabelInput
              isRequire={job.email === "MANDATORY"}
              title="Email Address"
            />
            <input
              disabled={job.email === "OFF"}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ex. johndoe@example.com"
              className="w-full px-4 py-2 border-2 border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#01959F]"
            />
          </div>

          {/* LinkedIn */}
          <div>
            <LabelInput
              isRequire={job.linkedin === "MANDATORY"}
              title="LinkedIn Profile"
            />
            {/* <input
              disabled={job.linkedin === "OFF"}
              type="url"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="Ex. https://linkedin.com/in/johndoe"
              className="w-full px-4 py-2 border-2 border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#01959F]"
            /> */}
            <CustomInputLinkedinUrl
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              disabled={job.linkedin === "OFF"}
            />
          </div>
        </div>
      </div>

      {/* Fixed Footer Button */}
      <div className="h-[88px] flex px-10 py-6 border-t border-gray-200 bg-white">
        <button
          onClick={handleSubmit}
          className="bg-[#01959F] text-white rounded-lg p-2 px-4 text-[12px] font-bold h-10 w-full disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Submitting...
            </>
          ) : (
            "Submit"
          )}
        </button>
      </div>
    </div>
  );
}
