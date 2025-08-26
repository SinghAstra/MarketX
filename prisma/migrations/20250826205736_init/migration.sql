-- CreateEnum
CREATE TYPE "public"."ApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'NEEDS_REVIEW');

-- CreateTable
CREATE TABLE "public"."Application" (
    "id" TEXT NOT NULL,
    "facebook_business_id" TEXT NOT NULL,
    "business_name" TEXT NOT NULL,
    "website_url" TEXT NOT NULL,
    "status" "public"."ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "admin_notes" TEXT,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Application_facebook_business_id_key" ON "public"."Application"("facebook_business_id");

-- CreateIndex
CREATE INDEX "Application_status_idx" ON "public"."Application"("status");
