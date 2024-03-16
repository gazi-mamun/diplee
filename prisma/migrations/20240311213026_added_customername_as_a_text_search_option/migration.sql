-- DropIndex
DROP INDEX `Order_id_customerNumber_customerAddress_idx` ON `order`;

-- CreateIndex
CREATE FULLTEXT INDEX `Order_id_customerName_customerNumber_customerAddress_idx` ON `Order`(`id`, `customerName`, `customerNumber`, `customerAddress`);
