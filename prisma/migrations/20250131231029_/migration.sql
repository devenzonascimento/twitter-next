/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Analytics" (
    "uuid" TEXT NOT NULL,
    "on" BOOLEAN NOT NULL,

    CONSTRAINT "Analytics_pkey" PRIMARY KEY ("uuid")
);
