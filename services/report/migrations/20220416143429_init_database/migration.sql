-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAWAL');
-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "transactionType" "TransactionType" NOT NULL,
    "token" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL
);
-- CreateTable
CREATE TABLE "LatestPortfolio" (
    "token" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL
);
-- CreateTable
CREATE TABLE "Metadata" (
    "id" SERIAL NOT NULL,
    "latestTransactionAt" TIMESTAMP(3),
    "isReportIngesting" BOOLEAN NOT NULL,
    CONSTRAINT "Metadata_pkey" PRIMARY KEY ("id")
);
-- CreateIndex
CREATE UNIQUE INDEX "Transaction_id_timestamp_key" ON "Transaction"("id", "timestamp");
-- CreateIndex
CREATE UNIQUE INDEX "LatestPortfolio_token_key" ON "LatestPortfolio"("token");
-- Create hyper table
SELECT create_hypertable('"Transaction"', 'timestamp');
