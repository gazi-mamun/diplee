import {
  Injectable,
  Query,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import * as fs from 'fs';

@Injectable()
export class ProductImageService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(@Query() query) {
    const page = query.page * 1 || 1;
    const limit = query.limit * 1 || 20;
    const skip = (page - 1) * limit;

    return await this.databaseService.productImage.findMany({
      skip,
      take: limit,
    });
  }

  async findOne(id: string) {
    return await this.databaseService.productImage.findUnique({
      where: {
        id,
      },
    });
  }

  async update(
    id: string,
    updateProductImageDto: Prisma.ProductImageUpdateInput,
  ) {
    delete updateProductImageDto.url;
    if (updateProductImageDto.type === 'SECONDARY') {
      throw new UnprocessableEntityException(
        'To mark this image as secondary please mark other image as primary',
      );
    }

    // CHANGING IMAGE TYPE
    const updatedImage = await this.databaseService.productImage.update({
      where: {
        id,
      },
      data: {
        type: updateProductImageDto.type,
      },
    });

    // FINDING PRODUCT
    const product = await this.databaseService.product.findUnique({
      where: {
        id: updatedImage.productId,
      },
    });

    // UPDATING THE OLD PRIMARY IMAGE TO SECONDARY
    if (product.primaryImageUrl !== null) {
      await this.databaseService.productImage.update({
        where: {
          url: product.primaryImageUrl,
        },
        data: {
          type: 'SECONDARY',
        },
      });
    }

    // ADDING PRIMARY IMAGE URL TO PRODUCT
    await this.databaseService.product.update({
      where: {
        id: updatedImage.productId,
      },
      data: {
        primaryImageUrl: updatedImage.url,
      },
    });

    return updatedImage;
  }

  async remove(id: string) {
    const deletedImage = await this.databaseService.productImage.delete({
      where: {
        id,
      },
    });

    const foundProduct = await this.databaseService.product.findUnique({
      where: {
        id: deletedImage?.productId,
        primaryImageUrl: deletedImage?.url,
      },
    });

    if (foundProduct) {
      await this.databaseService.product.update({
        where: {
          id: foundProduct?.id,
        },
        data: {
          primaryImageUrl: null,
        },
      });
    }

    if (fs.existsSync(deletedImage.url)) {
      fs.unlinkSync(deletedImage.url);
    }

    return deletedImage;
  }
}
