/*
  Warnings:

  - You are about to drop the column `paid` on the `order` table. All the data in the column will be lost.
  - Added the required column `customerAddress` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerNumber` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `paid`,
    ADD COLUMN `customerAddress` VARCHAR(191) NOT NULL,
    ADD COLUMN `customerNumber` INTEGER NOT NULL,
    ADD COLUMN `quantity` INTEGER NOT NULL,
    ADD COLUMN `status` ENUM('pending', 'inDelivery', 'delivered') NOT NULL;
