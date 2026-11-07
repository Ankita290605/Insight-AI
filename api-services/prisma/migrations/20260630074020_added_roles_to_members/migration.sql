/*
  Warnings:

  - Added the required column `role` to the `WorkspaceMember` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('MEMBER', 'ADMIN', 'OWNER');

-- AlterTable
ALTER TABLE "WorkspaceMember" ADD COLUMN     "role" "Roles" NOT NULL;
