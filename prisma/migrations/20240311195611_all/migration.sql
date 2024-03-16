/*
  Warnings:

  - Added the required column `customerName` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliveryCharge` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `division` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` ADD COLUMN `customerName` VARCHAR(100) NOT NULL,
    ADD COLUMN `deliveryCharge` DOUBLE NOT NULL,
    ADD COLUMN `division` ENUM('BARISAL', 'CHITTAGONG', 'DHAKA', 'KHULNA', 'MYMENSINGH', 'RAJSHAHI', 'RANGPUR', 'SYLHET') NOT NULL;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `category` VARCHAR(80) NOT NULL;
