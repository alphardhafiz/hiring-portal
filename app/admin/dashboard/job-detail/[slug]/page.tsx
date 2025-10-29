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

type SortField = "fullName" | "email" | "gender" | "domicile" | "phoneNumber" | "linkedin" | "dateOfBirth" | "createdAt";
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

  const sortedApplicants = data?.applicants ? [...data.applicants].sort((a, b) => {
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
  }) : [];

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    return sortOrder === "asc" ? (
      <svg className="w-4 h-4 text-[#01959F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-[#01959F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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
      <main className="m-6">
        {/* Back Button */}
        <button
          onClick={() => router.push("/admin/dashboard")}
          className="mb-4 flex items-center gap-2 text-[#01959F] hover:text-[#017a82] transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Dashboard
        </button>

        {/* Job Info */}
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">{job.jobName}</h1>
              <div className="flex items-center gap-4">
                <JobStatusBadge status={job.status} />
                <span className="text-sm text-gray-600">{job.jobType}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Salary Range</p>
              <p className="font-semibold">
                Rp{formatRupiah(job.minSalary!)} - Rp{formatRupiah(job.maxSalary!)}
              </p>
            </div>
          </div>
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-600">
              Total Applicants: <span className="font-semibold text-gray-900">{sortedApplicants.length}</span>
            </p>
          </div>
        </div>

        {/* Applicants Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Applicants List</h2>
          </div>

          {sortedApplicants.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <p className="text-gray-600 font-semibold mb-2">No applicants yet</p>
              <p className="text-sm text-gray-500">
                Applicants will appear here once they apply for this position.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th 
                      onClick={() => handleSort("fullName")}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        Applicant
                        <SortIcon field="fullName" />
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort("email")}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        Email
                        <SortIcon field="email" />
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort("phoneNumber")}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        Phone
                        <SortIcon field="phoneNumber" />
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort("gender")}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        Gender
                        <SortIcon field="gender" />
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort("domicile")}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        Domicile
                        <SortIcon field="domicile" />
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort("dateOfBirth")}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        Date of Birth
                        <SortIcon field="dateOfBirth" />
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort("linkedin")}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        LinkedIn
                        <SortIcon field="linkedin" />
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort("createdAt")}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        Applied Date
                        <SortIcon field="createdAt" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedApplicants.map((applicant) => (
                    <tr key={applicant.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={applicant.photoProfile || "/images/default-avatar.png"}
                              alt={applicant.fullName}
                              onError={(e) => {
                                e.currentTarget.src = "/images/default-avatar.png";
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {applicant.fullName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{applicant.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {applicant.phoneNumber || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {applicant.gender || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {applicant.domicile || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {applicant.dateOfBirth 
                            ? format(new Date(applicant.dateOfBirth), "dd MMM yyyy")
                            : "-"
                          }
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
                            View Profile
                          </a>
                        ) : (
                          <span className="text-sm text-gray-900">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {format(new Date(applicant.createdAt), "dd MMM yyyy")}
                        </div>
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