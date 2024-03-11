import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ProductVariantService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createProductVariantDto: Prisma.ProductVariantCreateInput) {
    const newVariant = await this.databaseService.productVariant.create({
      data: createProductVariantDto,
    });

    const product = await this.databaseService.product.findUnique({
      where: {
        id: newVariant.productId,
      },
    });

    await this.databaseService.product.update({
      where: {
        id: product.id,
      },
      data: {
        inStock: product.inStock + newVariant.inStock,
      },
    });

    return newVariant;
  }

  async findOne(id: string) {
    return await this.databaseService.productVariant.findUnique({
      where: {
        id,
      },
    });
  }

  async findOneBySKU(sku: string) {
    return await this.databaseService.productVariant.findUnique({
      where: {
        sku,
      },
    });
  }

  async update(
    id: string,
    updateProductVariantDto: Prisma.ProductVariantUpdateInput,
  ) {
    const updatedVariant = await this.databaseService.productVariant.update({
      where: {
        id,
      },
      data: updateProductVariantDto,
    });

    const agg = await this.databaseService.productVariant.aggregate({
      _sum: {
        inStock: true,
      },
      where: {
        productId: updatedVariant?.productId,
      },
    });

    const totalProduct = agg._sum.inStock;

    await this.databaseService.product.update({
      where: {
        id: updatedVariant?.productId,
      },
      data: {
        inStock: totalProduct,
      },
    });

    return updatedVariant;
  }

  async remove(id: string) {
    const deletedVariant = await this.databaseService.productVariant.delete({
      where: {
        id,
      },
    });

    const product = await this.databaseService.product.findUnique({
      where: {
        id: deletedVariant.productId,
      },
    });

    await this.databaseService.product.update({
      where: {
        id: product.id,
      },
      data: {
        inStock: product.inStock - deletedVariant.inStock,
      },
    });

    return deletedVariant;
  }
}
