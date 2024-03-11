-- CreateIndex
CREATE FULLTEXT INDEX `Order_customerNumber_customerAddress_idx` ON `Order`(`customerNumber`, `customerAddress`);

-- CreateIndex
CREATE FULLTEXT INDEX `Product_name_description_sku_idx` ON `Product`(`name`, `description`, `sku`);

-- CreateIndex
CREATE FULLTEXT INDEX `ProductVariant_size_color_sku_idx` ON `ProductVariant`(`size`, `color`, `sku`);
