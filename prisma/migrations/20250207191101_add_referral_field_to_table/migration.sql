-- AlterTable
ALTER TABLE "User" ADD COLUMN     "referred_id" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_referred_id_fkey" FOREIGN KEY ("referred_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
