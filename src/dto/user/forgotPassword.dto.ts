import { IsEmail } from 'class-validator';

export class ForgotPasswordDTO {
  @IsEmail({}, { message: 'error.invalidEmail' })
  email: string;

  constructor(data: any) {
    this.email = data.email;
  }
}
