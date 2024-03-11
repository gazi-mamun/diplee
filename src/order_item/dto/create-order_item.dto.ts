import { IsDecimal, IsInt, IsNotEmpty } from 'class-validator';

export class CreateOrderItemDto {
  @IsNotEmpty()
  orderId: string;

  productId: string;

  @IsNotEmpty()
  productSku: string;

  productVariantId: string;

  @IsNotEmpty()
  productVariantSku: string;

  size: string;
  color: string;

  @IsNotEmpty()
  @IsInt()
  quantity: number;

  @IsDecimal()
  price: number;
}
