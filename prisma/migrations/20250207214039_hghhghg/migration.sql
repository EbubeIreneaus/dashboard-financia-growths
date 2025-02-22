-- AlterTable
ALTER TABLE "Investment" ALTER COLUMN "start_date" DROP NOT NULL,
ALTER COLUMN "next_due_date" DROP NOT NULL,
ALTER COLUMN "roi" DROP NOT NULL;
