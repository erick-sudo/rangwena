/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `OneTimePassword` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[value]` on the table `OneTimePassword` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "OneTimePassword_userId_key" ON "OneTimePassword"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "OneTimePassword_value_key" ON "OneTimePassword"("value");
