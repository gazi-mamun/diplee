import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createCategoryDto: Prisma.CategoryCreateInput) {
    return await this.databaseService.category.create({
      data: createCategoryDto,
    });
  }

  async findAll() {
    return await this.databaseService.category.findMany();
  }

  async findOne(id: string) {
    return await this.databaseService.category.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateCategoryDto: Prisma.CategoryUpdateInput) {
    const cat = await this.databaseService.category.findUnique({
      where: {
        id,
      },
    });

    const updatedCat = await this.databaseService.category.update({
      where: {
        id,
      },
      data: updateCategoryDto,
    });

    if (updatedCat && updatedCat?.name !== cat?.name) {
      await this.databaseService.product.updateMany({
        where: {
          category: cat.name,
        },
        data: {
          category: updatedCat.name,
        },
      });
    }

    return updatedCat;
  }

  async remove(id: string) {
    const deletedCat = await this.databaseService.category.delete({
      where: {
        id,
      },
    });

    if (deletedCat) {
      await this.databaseService.product.deleteMany({
        where: {
          category: deletedCat?.name,
        },
      });
    }

    return deletedCat;
  }
}
