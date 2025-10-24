-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('FULL_TIME', 'CONTRACT', 'PART_TIME', 'INTERNSHIP', 'FREELANCE');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'DRAFT');

-- CreateEnum
CREATE TYPE "FieldRequirement" AS ENUM ('MANDATORY', 'OPTIONAL', 'OFF');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateTable
CREATE TABLE "Job" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "jobName" TEXT NOT NULL,
    "jobType" "JobType" NOT NULL,
    "jobDescription" TEXT,
    "numOfCandidate" INTEGER NOT NULL DEFAULT 0,
    "minSalary" INTEGER,
    "maxSalary" INTEGER,
    "status" "JobStatus" NOT NULL DEFAULT 'DRAFT',
    "fullName" "FieldRequirement" NOT NULL DEFAULT 'MANDATORY',
    "photoProfile" "FieldRequirement" NOT NULL DEFAULT 'MANDATORY',
    "gender" "FieldRequirement" NOT NULL DEFAULT 'OPTIONAL',
    "domicile" "FieldRequirement" NOT NULL DEFAULT 'OPTIONAL',
    "email" "FieldRequirement" NOT NULL DEFAULT 'MANDATORY',
    "phoneNumber" "FieldRequirement" NOT NULL DEFAULT 'OPTIONAL',
    "linkedin" "FieldRequirement" NOT NULL DEFAULT 'OFF',
    "dateOfBirth" "FieldRequirement" NOT NULL DEFAULT 'OPTIONAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Applicant" (
    "id" SERIAL NOT NULL,
    "jobId" INTEGER NOT NULL,
    "fullName" TEXT NOT NULL,
    "photoProfile" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "gender" "Gender",
    "domicile" TEXT,
    "phoneNumber" TEXT,
    "linkedin" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Applicant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Job_slug_key" ON "Job"("slug");

-- AddForeignKey
ALTER TABLE "Applicant" ADD CONSTRAINT "Applicant_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
