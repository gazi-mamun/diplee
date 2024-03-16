import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Prisma } from '@prisma/client';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Public()
  create(@Body() createOrderDto: Prisma.OrderCreateInput) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  findAll(@Query() query) {
    return this.orderService.findAll(query);
  }

  @Get('/search')
  search(@Query() query) {
    return this.orderService.search(query);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: Prisma.OrderUpdateInput,
  ) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Patch('/by-admin/:id')
  updateByAdmin(
    @Param('id') id: string,
    @Body() updateOrderDto: Prisma.OrderUpdateInput,
  ) {
    return this.orderService.updateByAdmin(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
