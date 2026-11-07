/*
  Warnings:

  - A unique constraint covering the columns `[name,created_by]` on the table `Workspace` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Workspace_name_created_by_key" ON "Workspace"("name", "created_by");
