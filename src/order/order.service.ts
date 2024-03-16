import { Injectable, Query } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { EmailService } from 'src/email/emailService';

@Injectable()
export class OrderService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createOrderDto: Prisma.OrderCreateInput) {
    delete createOrderDto.totalAmount;
    delete createOrderDto.status;

    if (createOrderDto?.division === 'DHAKA') {
      createOrderDto.deliveryCharge = 100.0;
    } else {
      createOrderDto.deliveryCharge = 150.0;
    }

    const newOrder = await this.databaseService.order.create({
      data: createOrderDto,
    });

    if (newOrder) {
      const link = 'https://admin.diplee.com/orders/details/' + newOrder?.id;
      await new EmailService(
        'rakibsamim36@gmail.com',
        link,
      ).orderNotification();
    }

    return newOrder;
  }

  async findAll(@Query() query) {
    const page = query.page * 1 || 1;
    const limit = query.limit * 1 || 20;
    const skip = (page - 1) * limit;

    const status = query.status === 'undefined' ? null : query.status || null;
    const customerNumber =
      query.customerNumber === 'undefined'
        ? null
        : query.customerNumber || null;

    const orderCount = await this.databaseService.order.aggregate({
      where: {
        status: status !== null ? status : undefined,
        customerNumber: customerNumber !== null ? customerNumber : undefined,
      },
      _count: {
        _all: true,
      },
    });

    const totalPages = Math.ceil(orderCount._count._all / limit);

    const orders = await this.databaseService.order.findMany({
      skip,
      take: limit,
      where: {
        status: status !== null ? status : undefined,
        customerNumber: customerNumber !== null ? customerNumber : undefined,
      },
    });

    return {
      orders: orders,
      totalPages,
      currentPage: page,
    };
  }

  async findOne(id: string) {
    return await this.databaseService.order.findUnique({
      where: {
        id,
      },
      include: {
        orderItems: true,
      },
    });
  }

  async update(id: string, updateOrderDto: Prisma.OrderUpdateInput) {
    if (updateOrderDto.deliveryCharge) {
      delete updateOrderDto.deliveryCharge;
    }
    if (updateOrderDto.division) {
      if (updateOrderDto.division === 'DHAKA') {
        updateOrderDto.deliveryCharge = 100.0;
      } else {
        updateOrderDto.deliveryCharge = 120.0;
      }
    }
    return await this.databaseService.order.update({
      where: {
        id,
      },
      data: updateOrderDto,
    });
  }

  async updateByAdmin(id: string, updateOrderDto: Prisma.OrderUpdateInput) {
    return await this.databaseService.order.update({
      where: {
        id,
      },
      data: updateOrderDto,
    });
  }

  async remove(id: string) {
    return await this.databaseService.order.delete({
      where: {
        id,
      },
    });
  }

  async search(@Query() query) {
    const searchTerm = query.searchterm || '';

    const result = await this.databaseService.order.findMany({
      where: {
        id: {
          search: searchTerm,
        },
        customerName: {
          search: searchTerm,
        },
        customerNumber: {
          search: searchTerm,
        },
        customerAddress: {
          search: searchTerm,
        },
      },
    });

    return result;
  }
}
