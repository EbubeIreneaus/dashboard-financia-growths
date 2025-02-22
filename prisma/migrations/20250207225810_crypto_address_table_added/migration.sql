-- CreateTable
CREATE TABLE "CryptoAddress" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "address" VARCHAR(100) NOT NULL,
    "qrcode" TEXT NOT NULL,

    CONSTRAINT "CryptoAddress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CryptoAddress_name_key" ON "CryptoAddress"("name");
