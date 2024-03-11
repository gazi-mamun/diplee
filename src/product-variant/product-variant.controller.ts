import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Post,
} from '@nestjs/common';
import { ProductVariantService } from './product-variant.service';
import { Prisma } from '@prisma/client';

@Controller('product-variants')
export class ProductVariantController {
  constructor(private readonly productVariantService: ProductVariantService) {}

  @Post()
  create(@Body() createProductVariantDto: Prisma.ProductVariantCreateInput) {
    return this.productVariantService.create(createProductVariantDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productVariantService.findOne(id);
  }

  @Get(':sku')
  findOneBySKU(@Param('sku') sku: string) {
    return this.productVariantService.findOneBySKU(sku);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductVariantDto: Prisma.ProductVariantUpdateInput,
  ) {
    return this.productVariantService.update(id, updateProductVariantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productVariantService.remove(id);
  }
}
