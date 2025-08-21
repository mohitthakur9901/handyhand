/*
  Warnings:

  - You are about to drop the column `location` on the `Gig` table. All the data in the column will be lost.
  - Added the required column `address` to the `Gig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Gig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Gig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalCode` to the `Gig` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Gig" DROP COLUMN "location",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "postalCode" TEXT NOT NULL;
