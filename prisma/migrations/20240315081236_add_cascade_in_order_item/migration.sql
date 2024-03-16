-- DropForeignKey
ALTER TABLE `order_item` DROP FOREIGN KEY `Order_item_orderId_fkey`;

-- AddForeignKey
ALTER TABLE `Order_item` ADD CONSTRAINT `Order_item_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
