// app/api/jobs/[slug]/route.ts
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

interface Params {
  slug: string;
}

export async function GET(req: Request, { params }: { params: Params }) {
  try {
    const { slug } = params;
    console.log(params)
    const job = await prisma.job.findUnique({
      where: { slug },
    });

    if (!job) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(job, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch job", error: String(error) },
      { status: 500 }
    );
  }
}
