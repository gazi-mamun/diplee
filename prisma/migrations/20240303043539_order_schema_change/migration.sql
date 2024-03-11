/*
  Warnings:

  - You are about to drop the column `amount` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `productName` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `productSku` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `productVariantId` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `productVariantSku` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `order` table. All the data in the column will be lost.
  - Added the required column `totalAmount` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `amount`,
    DROP COLUMN `color`,
    DROP COLUMN `productId`,
    DROP COLUMN `productName`,
    DROP COLUMN `productSku`,
    DROP COLUMN `productVariantId`,
    DROP COLUMN `productVariantSku`,
    DROP COLUMN `quantity`,
    DROP COLUMN `size`,
    ADD COLUMN `totalAmount` DOUBLE NOT NULL;

-- CreateTable
CREATE TABLE `Order_item` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `productSku` INTEGER NOT NULL,
    `productVariantId` VARCHAR(191) NOT NULL,
    `productVariantSku` INTEGER NOT NULL,
    `size` VARCHAR(10) NOT NULL,
    `color` VARCHAR(20) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Order_item` ADD CONSTRAINT `Order_item_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
