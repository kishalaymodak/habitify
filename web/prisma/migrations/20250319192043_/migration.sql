/*
  Warnings:

  - You are about to drop the column `totalActivity` on the `TaskActivity` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userEmail]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `totalActivity` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "totalActivity" INTEGER NOT NULL,
ALTER COLUMN "createDate" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "TaskActivity" DROP COLUMN "totalActivity";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_userEmail_key" ON "User"("userEmail");
