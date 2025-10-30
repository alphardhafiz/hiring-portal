"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Applicant, Job } from "@prisma/client";
import Header from "@/components/Header";
import JobStatusBadge from "@/components/JobStatusBadge";
import formatRupiah from "@/utils/formatRupiah";
import { format } from "date-fns";

interface JobWithApplicants {
  job: Job;
  applicants: Applicant[];
}

type SortField =
  | "fullName"
  | "email"
  | "gender"
  | "domicile"
  | "phoneNumber"
  | "linkedin"
  | "dateOfBirth"
  | "createdAt";
type SortOrder = "asc" | "desc";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [data, setData] = useState<JobWithApplicants | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/jobs/${slug}/applicants`);

        if (!res.ok) {
          if (res.status === 404) {
            router.push("/admin/dashboard");
            return;
          }
          throw new Error("Failed to fetch job details");
        }

        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchJobDetail();
    }
  }, [slug, router]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedApplicants = data?.applicants
    ? [...data.applicants].sort((a, b) => {
        let aValue: any = a[sortField];
        let bValue: any = b[sortField];

        // Handle null/undefined values
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        // Convert to string for comparison (except dates)
        if (sortField === "dateOfBirth" || sortField === "createdAt") {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        } else {
          aValue = String(aValue).toLowerCase();
          bValue = String(bValue).toLowerCase();
        }

        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        return 0;
      })
    : [];

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return (
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      );
    }

    return sortOrder === "asc" ? (
      <svg
        className="w-4 h-4 text-[#01959F]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      </svg>
    ) : (
      <svg
        className="w-4 h-4 text-[#01959F]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#01959F] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { job } = data;

  return (
    <>
      <Header />
      <main className="m-6 flex flex-col min-h-[calc(100vh-7rem)]">
        {/* Job Info */}
        <h1 className="text-2xl font-bold mb-6">{job.jobName}</h1>

        {/* Applicants Table */}
        <div className="bg-white border flex flex-1 border-[#E0E0E0] overflow-hidden rounded-lg p-6">
          {sortedApplicants.length === 0 ? (
            <div className="flex flex-col justify-center items-center w-full gap-6">
              <img
                src="/images/icon-candidate-empty.svg"
                alt="iconjobempty"
                className="w-[300px]"
              />
              <div className="text-center">
                <p className="text-gray-600 font-semibold mb-2">
                  No candidates found
                </p>
                <p className="text-sm text-gray-500">
                  Share your job vacancies so that more candidates will apply.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th
                      onClick={() => handleSort("fullName")}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        NAMA LENGKAP
                        <SortIcon field="fullName" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("email")}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        EMAIL ADDRESS
                        <SortIcon field="email" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("phoneNumber")}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        PHONE NUMBERS
                        <SortIcon field="phoneNumber" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("dateOfBirth")}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        DATE OF BIRTH
                        <SortIcon field="dateOfBirth" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("domicile")}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        DOMICILE
                        <SortIcon field="domicile" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("gender")}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        GENDER
                        <SortIcon field="gender" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("linkedin")}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        LINK LINKEDIN
                        <SortIcon field="linkedin" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedApplicants.map((applicant) => (
                    <tr
                      key={applicant.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {applicant.fullName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {applicant.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {applicant.phoneNumber || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {applicant.dateOfBirth
                            ? format(
                                new Date(applicant.dateOfBirth),
                                "dd MMM yyyy"
                              )
                            : "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {applicant.domicile || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {applicant.gender || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {applicant.linkedin ? (
                          <a
                            href={applicant.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 underline"
                          >
                           {applicant.linkedin}
                          </a>
                        ) : (
                          <span className="text-sm text-gray-900">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
