import { IsEmail, IsEnum, Length } from 'class-validator';
import { LengthInput, PaymentMethod } from '../../constants';

export class CreateOrderDTO {
  @Length(LengthInput.MIN_LENGTH, LengthInput.MAX_LENGTH, { message: 'error.nameLengthError' })
  name: string;

  @Length(LengthInput.MIN_LENGTH, LengthInput.MAX_LENGTH, { message: 'error.phoneLengthError' })
  phone: string;

  @IsEmail({}, { message: 'error.invalidEmail' })
  email: string;

  @Length(LengthInput.MIN_LENGTH_TEXT, LengthInput.MAX_LENGTH_TEXT, { message: 'error.addressLengthError' })
  address: string;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  constructor(data: any) {
    this.name = data.name;
    this.phone = data.phone;
    this.email = data.email;
    this.address = data.address;
    this.paymentMethod = data.paymentMethod;
  }
}
