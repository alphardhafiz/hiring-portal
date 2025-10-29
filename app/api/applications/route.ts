import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { supabase } from "@/app/lib/supabaseClient"; // pastikan client Supabase sudah siap

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const jobId = parseInt(formData.get("jobId") as string);
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const phoneNumber = formData.get("phoneNumber") as string | null;
    const photoProfile = formData.get("photoProfile") as File;
    const gender = formData.get("gender") as string | null;
    const domicile = formData.get("domicile") as string | null;
    const linkedin = formData.get("linkedin") as string | null;
    const dateOfBirth = formData.get("dateOfBirth") as string | null;

    if (!jobId || !fullName || !email || !photoProfile) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Upload ke Supabase Storage
    const timestamp = Date.now();
    const filename = `${timestamp}-${photoProfile.name}`;
    const fileBytes = Buffer.from(await photoProfile.arrayBuffer());

    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from("profile-photos") // ganti sesuai nama bucket
      .upload(filename, fileBytes, {
        cacheControl: "3600",
        upsert: false,
        contentType: photoProfile.type
      });

    if (uploadError) {
      console.log("Supabase upload error:", uploadError);
      return NextResponse.json({ message: "Failed to upload photo" }, { status: 500 });
    }

    const publicUrl = supabase.storage.from("profile-photos").getPublicUrl(filename).data.publicUrl;

    // Create applicant di database
    const applicant = await prisma.applicant.create({
      data: {
        jobId,
        fullName,
        email,
        phoneNumber,
        photoProfile: publicUrl,
        gender: gender as "MALE" | "FEMALE" | null,
        domicile,
        linkedin,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      },
    });

    return NextResponse.json({ message: "Application submitted successfully", applicant }, { status: 201 });
  } catch (error) {
    console.error("Error creating applicant:", error);
    return NextResponse.json({ message: "Failed to submit application" }, { status: 500 });
  }
}
