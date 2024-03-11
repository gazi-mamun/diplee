-- AlterTable
ALTER TABLE `user` MODIFY `passwordChangeAt` DATETIME(3) NULL,
    MODIFY `passwordResetOtpCode` VARCHAR(191) NULL,
    MODIFY `passwordResetExpires` DATETIME(3) NULL;
