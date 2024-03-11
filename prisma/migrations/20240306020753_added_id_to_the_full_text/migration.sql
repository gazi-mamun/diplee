-- DropIndex
DROP INDEX `Order_customerNumber_customerAddress_idx` ON `order`;

-- DropIndex
DROP INDEX `Product_name_description_sku_idx` ON `product`;

-- DropIndex
DROP INDEX `ProductVariant_size_color_sku_idx` ON `productvariant`;

-- CreateIndex
CREATE FULLTEXT INDEX `Order_id_customerNumber_customerAddress_idx` ON `Order`(`id`, `customerNumber`, `customerAddress`);

-- CreateIndex
CREATE FULLTEXT INDEX `Product_id_name_description_sku_idx` ON `Product`(`id`, `name`, `description`, `sku`);

-- CreateIndex
CREATE FULLTEXT INDEX `ProductVariant_id_size_color_sku_idx` ON `ProductVariant`(`id`, `size`, `color`, `sku`);

-- CreateIndex
CREATE FULLTEXT INDEX `User_id_email_idx` ON `User`(`id`, `email`);
