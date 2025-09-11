/*
  Warnings:

  - You are about to alter the column `title` on the `articles` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(200)`.
  - You are about to alter the column `slug` on the `articles` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(200)`.
  - You are about to alter the column `readTime` on the `articles` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `imageColor` on the `articles` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `name` on the `categories` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `slug` on the `categories` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `icon` on the `categories` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `color` on the `categories` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `textColor` on the `categories` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `name` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `username` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `email` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `password` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `location` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `website` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `role` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `twitter` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `linkedin` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `github` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "public"."articles" ALTER COLUMN "title" SET DATA TYPE VARCHAR(200),
ALTER COLUMN "slug" SET DATA TYPE VARCHAR(200),
ALTER COLUMN "publishedAt" SET DATA TYPE TIMESTAMP(6),
ALTER COLUMN "readTime" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "imageColor" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(6),
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(6);

-- AlterTable
ALTER TABLE "public"."categories" ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "slug" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "icon" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "color" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "textColor" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(6),
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(6);

-- AlterTable
ALTER TABLE "public"."comments" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(6),
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(6);

-- AlterTable
ALTER TABLE "public"."users" ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "username" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "joinedAt" SET DATA TYPE TIMESTAMP(6),
ALTER COLUMN "location" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "website" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "role" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "twitter" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "linkedin" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "github" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(6),
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(6);

-- CreateTable
CREATE TABLE "public"."password_reset_tokens" (
    "id" SERIAL NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "expiresAt" TIMESTAMP(6) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."password_reset_codes" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(6) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "expiresAt" TIMESTAMP(6) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "password_reset_codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_token_key" ON "public"."password_reset_tokens"("token");

-- CreateIndex
CREATE INDEX "password_reset_tokens_token_idx" ON "public"."password_reset_tokens"("token");

-- CreateIndex
CREATE INDEX "password_reset_tokens_email_idx" ON "public"."password_reset_tokens"("email");

-- CreateIndex
CREATE INDEX "password_reset_tokens_expiresAt_idx" ON "public"."password_reset_tokens"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_codes_code_key" ON "public"."password_reset_codes"("code");

-- CreateIndex
CREATE INDEX "password_reset_codes_code_idx" ON "public"."password_reset_codes"("code");

-- CreateIndex
CREATE INDEX "password_reset_codes_email_idx" ON "public"."password_reset_codes"("email");

-- CreateIndex
CREATE INDEX "password_reset_codes_expiresAt_idx" ON "public"."password_reset_codes"("expiresAt");

-- CreateIndex
CREATE INDEX "articles_authorId_idx" ON "public"."articles"("authorId");

-- CreateIndex
CREATE INDEX "articles_categoryId_idx" ON "public"."articles"("categoryId");

-- CreateIndex
CREATE INDEX "articles_published_idx" ON "public"."articles"("published");

-- CreateIndex
CREATE INDEX "articles_featured_idx" ON "public"."articles"("featured");

-- CreateIndex
CREATE INDEX "articles_publishedAt_idx" ON "public"."articles"("publishedAt");

-- CreateIndex
CREATE INDEX "articles_slug_idx" ON "public"."articles"("slug");

-- CreateIndex
CREATE INDEX "articles_published_publishedAt_idx" ON "public"."articles"("published", "publishedAt");

-- CreateIndex
CREATE INDEX "articles_published_featured_publishedAt_idx" ON "public"."articles"("published", "featured", "publishedAt");

-- CreateIndex
CREATE INDEX "categories_slug_idx" ON "public"."categories"("slug");

-- CreateIndex
CREATE INDEX "categories_name_idx" ON "public"."categories"("name");

-- CreateIndex
CREATE INDEX "comments_articleId_idx" ON "public"."comments"("articleId");

-- CreateIndex
CREATE INDEX "comments_authorId_idx" ON "public"."comments"("authorId");

-- CreateIndex
CREATE INDEX "comments_parentId_idx" ON "public"."comments"("parentId");

-- CreateIndex
CREATE INDEX "comments_createdAt_idx" ON "public"."comments"("createdAt");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "public"."users"("username");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "public"."users"("role");

-- CreateIndex
CREATE INDEX "users_createdAt_idx" ON "public"."users"("createdAt");
