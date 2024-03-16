import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { CreateOrderItemDto } from './dto/create-order_item.dto';

@Injectable()
export class OrderItemService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createOrderItemDto: CreateOrderItemDto) {
    const order = await this.databaseService.order.findUnique({
      where: {
        id: createOrderItemDto?.orderId,
      },
    });

    if (
      !order ||
      order.status === 'INDELIVERY' ||
      order.status === 'DELIVERED'
    ) {
      throw new UnprocessableEntityException(
        'This order is already in delivery or delivered',
      );
    }

    const product = await this.databaseService.product.findUnique({
      where: {
        sku: createOrderItemDto.productSku,
      },
    });

    if (!product) {
      throw new NotFoundException('There is no product with this id');
    }

    const productVariant = await this.databaseService.productVariant.findUnique(
      {
        where: {
          sku: createOrderItemDto.productVariantSku,
        },
      },
    );

    if (!productVariant) {
      throw new NotFoundException('There is not product varinat with this id');
    }

    if (productVariant.productId !== product.id) {
      throw new UnprocessableEntityException(
        'This variant does not belong to the product you have selected.',
      );
    }

    createOrderItemDto.productId = product.id;
    createOrderItemDto.productVariantId = productVariant.id;
    createOrderItemDto.size = productVariant.size;
    createOrderItemDto.color = productVariant.color;
    createOrderItemDto.price = product.price * createOrderItemDto.quantity;

    const createdOrderItem = await this.databaseService.order_item.create({
      data: createOrderItemDto,
    });

    const agg = await this.databaseService.order_item.aggregate({
      _sum: {
        price: true,
      },
      where: {
        orderId: createdOrderItem?.orderId,
      },
    });

    const totalAmount = agg._sum.price;

    await this.databaseService.order.update({
      where: {
        id: createdOrderItem?.orderId,
      },
      data: {
        totalAmount: totalAmount,
      },
    });

    return createdOrderItem;
  }

  async findOne(id: string) {
    return await this.databaseService.order_item.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateOrderItemDto: Prisma.Order_itemUpdateInput) {
    if (
      updateOrderItemDto.quantity === undefined ||
      updateOrderItemDto.quantity === null
    ) {
      throw new UnprocessableEntityException(
        'Only quanity is updagradable for order item',
      );
    }

    const orderItem = await this.databaseService.order_item.findUnique({
      where: {
        id,
      },
    });

    const product = await this.databaseService.product.findUnique({
      where: {
        id: orderItem.productId,
      },
    });

    const newPrice = product.price * +updateOrderItemDto.quantity;

    const updatedOrderItem = await this.databaseService.order_item.update({
      where: {
        id,
      },
      data: {
        quantity: updateOrderItemDto.quantity,
        price: newPrice,
      },
    });

    const agg = await this.databaseService.order_item.aggregate({
      _sum: {
        price: true,
      },
      where: {
        orderId: updatedOrderItem?.orderId,
      },
    });

    const totalAmount = agg._sum.price;

    await this.databaseService.order.update({
      where: {
        id: updatedOrderItem?.orderId,
      },
      data: {
        totalAmount: totalAmount,
      },
    });

    return updatedOrderItem;
  }

  async remove(id: string) {
    const deletedOrderItem = await this.databaseService.order_item.delete({
      where: {
        id,
      },
    });

    const agg = await this.databaseService.order_item.aggregate({
      _sum: {
        price: true,
      },
      where: {
        orderId: deletedOrderItem?.orderId,
      },
    });

    const totalAmount = agg._sum.price;

    await this.databaseService.order.update({
      where: {
        id: deletedOrderItem?.orderId,
      },
      data: {
        totalAmount: totalAmount,
      },
    });

    return deletedOrderItem;
  }
}
