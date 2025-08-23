/*
  Warnings:

  - You are about to drop the column `address` on the `Gig` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Gig` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Gig` table. All the data in the column will be lost.
  - You are about to drop the column `postalCode` on the `Gig` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Gig" DROP COLUMN "address",
DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "postalCode",
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION;
