import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { EmailService } from 'src/email/emailService';

@Module({
  imports: [EmailService],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
