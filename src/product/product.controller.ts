import { ProductService } from './product.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UnprocessableEntityException,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Prisma } from '@prisma/client';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Public } from 'src/common/decorators/public.decorator';

const multerOptions = {
  limits: {
    files: 7,
    fileSize: 5242880, // 5 mb in bytes
  },
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      const filename = `${uniqueSuffix}${ext}`;
      callback(null, filename);
    },
  }),
  fileFilter: (req, file, callback) => {
    if (file.mimetype.startsWith('image')) {
      callback(null, true);
    } else {
      callback(
        new UnprocessableEntityException(
          `Not an image! Please upload only images`,
        ),
        false,
      );
    }
  },
};

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: Prisma.ProductCreateInput) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @Public()
  findAll(@Query() query) {
    return this.productService.findAll(query);
  }

  @Get('/search')
  @Public()
  search(@Query() query) {
    return this.productService.search(query);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(AnyFilesInterceptor(multerOptions))
  update(
    @Param('id') id: string,
    @UploadedFiles()
    files: Array<Express.Multer.File>,
    @Body() updateProductDto: Prisma.ProductUpdateInput,
  ) {
    return this.productService.update(id, files, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
