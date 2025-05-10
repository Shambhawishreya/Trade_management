/*
  Warnings:

  - You are about to drop the column `Date` on the `Trades` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Trades_ticker_key";

-- AlterTable
ALTER TABLE "Trades" DROP COLUMN "Date",
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
