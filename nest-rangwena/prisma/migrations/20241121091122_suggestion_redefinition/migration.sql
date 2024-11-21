/*
  Warnings:

  - You are about to drop the `SuggestionDislike` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SuggestionLike` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SuggestionDislike" DROP CONSTRAINT "SuggestionDislike_suggestionId_fkey";

-- DropForeignKey
ALTER TABLE "SuggestionLike" DROP CONSTRAINT "SuggestionLike_suggestionId_fkey";

-- DropTable
DROP TABLE "SuggestionDislike";

-- DropTable
DROP TABLE "SuggestionLike";

-- CreateTable
CREATE TABLE "SuggestionReaction" (
    "id" TEXT NOT NULL,
    "reaction" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "suggestionId" TEXT NOT NULL,

    CONSTRAINT "SuggestionReaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SuggestionReaction" ADD CONSTRAINT "SuggestionReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuggestionReaction" ADD CONSTRAINT "SuggestionReaction_suggestionId_fkey" FOREIGN KEY ("suggestionId") REFERENCES "Suggestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
