// app/jobs/[slug]/page.tsx (Server Component)
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import React from "react";
import ApplyJobForm from "./_components/ApplyJobForm";

interface JobPageProps {
  params: { slug: string };
}

export default async function JobPage({ params }: JobPageProps) {
  const { slug } = params;

  // Fetch job dari database berdasarkan slug
  const job = await prisma.job.findUnique({
    where: { slug },
  });
  if (!job) return notFound();

  return <ApplyJobForm job={job} />;
}