import { Injectable, Query } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ProductService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createProductDto: Prisma.ProductCreateInput) {
    delete createProductDto.inStock;
    delete createProductDto.primaryImageUrl;
    let newProduct = await this.databaseService.product.create({
      data: createProductDto,
    });

    if (createProductDto.productVariants) {
      const agg = await this.databaseService.productVariant.aggregate({
        _sum: {
          inStock: true,
        },
        where: {
          productId: newProduct?.id,
        },
      });

      const totalProduct = agg._sum.inStock;

      if (totalProduct > 0) {
        newProduct = await this.databaseService.product.update({
          where: {
            id: newProduct?.id,
          },
          data: {
            inStock: totalProduct,
          },
        });
      }
    }

    return newProduct;
  }

  async findAll(@Query() query) {
    const page = query.page * 1 || 1;
    const limit = query.limit * 1 || 20;
    const skip = (page - 1) * limit;

    const speciality = query.speciality || null;
    let sortBy = query.sortby || null;
    if (sortBy == null || sortBy == 'undefined') {
      sortBy = 'createdAt-asc';
    }
    const inStock = query.instock || null;

    const orderBy = {
      [sortBy.split('-')[0]]: sortBy.split('-')[1] == 'desc' ? 'desc' : 'asc',
    };

    const productCount = await this.databaseService.product.aggregate({
      where: {
        speciality: speciality !== null ? speciality : undefined,
        AND: [
          {
            inStock: {
              gt:
                inStock == null ? undefined : inStock == 'true' ? 0 : undefined,
            },
          },
          {
            inStock: {
              lte:
                inStock == null
                  ? undefined
                  : inStock == 'false'
                    ? 0
                    : undefined,
            },
          },
        ],
      },
      _count: {
        _all: true,
      },
    });

    const totalPages = Math.ceil(productCount._count._all / limit);
    console.log(productCount, totalPages);

    const products = await this.databaseService.product.findMany({
      skip,
      take: limit,
      where: {
        speciality: speciality !== null ? speciality : undefined,
        AND: [
          {
            inStock: {
              gt:
                inStock == null ? undefined : inStock == 'true' ? 0 : undefined,
            },
          },
          {
            inStock: {
              lte:
                inStock == null
                  ? undefined
                  : inStock == 'false'
                    ? 0
                    : undefined,
            },
          },
        ],
      },
      orderBy,
    });

    products.map((pro) => {
      delete pro.description;
      delete pro.createdAt;
      delete pro.updatedAt;
    });

    return {
      products,
      totalPages,
      currentPage: page,
    };
  }

  async findOne(id: string) {
    return await this.databaseService.product.findUnique({
      where: {
        id,
      },
      include: {
        productVariants: true,
        productImages: true,
      },
    });
  }

  async update(
    id: string,
    files: Array<Express.Multer.File>,
    updateProductDto: Prisma.ProductUpdateInput,
  ) {
    delete updateProductDto.primaryImageUrl;
    if (files?.length > 0) {
      // IF PRODUCT.PRIMARYIMAGEURL IS EMPTY THEN
      // UPDATING IT WITH THE FIRST UPLOADED IMAGE

      const product = await this.databaseService.product.findUnique({
        where: {
          id,
        },
      });
      if (product.primaryImageUrl == null) {
        await this.databaseService.product.update({
          where: {
            id,
          },
          data: {
            primaryImageUrl: files[0].path,
          },
        });
      }

      files.map(async (file) => {
        await this.databaseService.productImage.create({
          data: {
            url: `${file.path}`,
            productId: id,
          },
        });
      });
    }

    return await this.databaseService.product.update({
      where: {
        id,
      },
      data: updateProductDto,
    });
  }

  async remove(id: string) {
    await this.databaseService.productVariant.deleteMany({
      where: {
        productId: id,
      },
    });
    return await this.databaseService.product.delete({
      where: {
        id,
      },
    });
  }

  async search(@Query() query) {
    const searchTerm = query.searchterm || '';

    const result = await this.databaseService.product.findMany({
      where: {
        id: {
          search: searchTerm,
        },
        name: {
          search: searchTerm,
        },
        description: {
          search: searchTerm,
        },
        sku: {
          search: searchTerm,
        },
      },
    });

    return result;
  }
}
