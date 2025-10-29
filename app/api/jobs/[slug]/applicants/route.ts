// app/api/jobs/[slug]/applicants/route.ts
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Find job by slug
    const job = await prisma.job.findUnique({
      where: { slug },
      include: {
        applicants: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      job: {
        id: job.id,
        jobName: job.jobName,
        jobType: job.jobType,
        status: job.status,
        minSalary: job.minSalary,
        maxSalary: job.maxSalary,
        numOfCandidate: job.numOfCandidate,
      },
      applicants: job.applicants,
    });
  } catch (error) {
    console.error("Error fetching applicants:", error);
    return NextResponse.json(
      { error: "Failed to fetch applicants" },
      { status: 500 }
    );
  }
}