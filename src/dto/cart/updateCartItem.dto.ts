import { IsNumber } from 'class-validator';

export class UpdateCartItemDTO {
  @IsNumber({}, { message: 'error.invalidQuantity' })
  quantity: number;

  @IsNumber({}, { message: 'error.invalidProductId' })
  productId: number;

  constructor(data: any) {
    this.quantity = data.quantity;
    this.productId = data.productId;
  }
}
