import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const slug = data.jobName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const job = await prisma.job.create({
      data: {
        slug,
        jobName: data.jobName,
        jobType: data.jobType,
        jobDescription: data.jobDescription || "",
        numOfCandidate: parseInt(data.numOfCandidate || 0),
        minSalary: data.minSalary ? parseInt(data.minSalary) : null,
        maxSalary: data.maxSalary ? parseInt(data.maxSalary) : null,
        fullName: data.fullName,
        photoProfile: data.photoProfile,
        gender: data.gender,
        domicile: data.domicile,
        email: data.email,
        phoneNumber: data.phoneNumber,
        linkedin: data.linkedin,
        dateOfBirth: data.dateOfBirth,
      },
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create job", error: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { search } = Object.fromEntries(new URL(req.url).searchParams);

    const jobs = await prisma.job.findMany({
      where: search
        ? {
            OR: [
              {
                jobName: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {},
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { message: "Failed to fetch jobs", error: String(error) },
      { status: 500 }
    );
  }
}
