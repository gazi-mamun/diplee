-- DropForeignKey
ALTER TABLE `order_item` DROP FOREIGN KEY `Order_item_orderId_fkey`;

-- AlterTable
ALTER TABLE `order_item` MODIFY `productSku` VARCHAR(191) NOT NULL,
    MODIFY `productVariantSku` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `product` MODIFY `sku` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `productvariant` MODIFY `sku` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Order_item` ADD CONSTRAINT `Order_item_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
