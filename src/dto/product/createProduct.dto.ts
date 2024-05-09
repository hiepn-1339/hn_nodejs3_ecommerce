import { IsEnum, IsNumber, Length } from 'class-validator';
import { EntityStatus, LengthInput } from '../../constants';

export class CreateProductDTO {
  @Length(LengthInput.MIN_LENGTH, LengthInput.MAX_LENGTH, { message: 'error.nameLengthError' })
  name: string;

  @IsNumber({}, { message: 'error.priceInvalid' })
  price: number;

  @IsNumber({}, { message: 'error.quantityInvalid' })
  quantity: number;

  @Length(LengthInput.MIN_LENGTH_TEXT, LengthInput.MAX_LENGTH_TEXT, { message: 'error.descriptionLengthError' })
  description: string;

  @IsEnum(EntityStatus, {message: 'error.statusInvalid'})
  status: EntityStatus;

  constructor(data: any) {
    this.name = data.name;
    this.price = parseInt(data.price);
    this.quantity = parseInt(data.quantity);
    this.description = data.description;
    this.status = data.status;
  }
}
