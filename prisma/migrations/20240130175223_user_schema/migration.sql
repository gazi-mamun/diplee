/*
  Warnings:

  - The primary key for the `productimage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `productimage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `productimage` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `type` ENUM('PRIMARY', 'SECONDARY') NOT NULL DEFAULT 'SECONDARY',
    ADD PRIMARY KEY (`url`);
