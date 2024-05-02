import { IsNotEmpty } from 'class-validator';

export class ApplyCouponDTO {
  @IsNotEmpty({message: 'error.couponInvalid'})
  name: string | undefined;

  constructor(data) {
    this.name = data.name;
  }
}
