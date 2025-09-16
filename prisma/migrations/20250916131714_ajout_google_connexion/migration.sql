/*
  Warnings:

  - A unique constraint covering the columns `[googleId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "googleId" VARCHAR(255),
ADD COLUMN     "provider" VARCHAR(20) DEFAULT 'local',
ALTER COLUMN "password" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_googleId_key" ON "public"."users"("googleId");

-- CreateIndex
CREATE INDEX "users_googleId_idx" ON "public"."users"("googleId");

-- CreateIndex
CREATE INDEX "users_provider_idx" ON "public"."users"("provider");
