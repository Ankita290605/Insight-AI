/*
  Warnings:

  - You are about to drop the `DocumentChunk` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DocumentChunk" DROP CONSTRAINT "DocumentChunk_document_id_fkey";

-- DropTable
DROP TABLE "DocumentChunk";
