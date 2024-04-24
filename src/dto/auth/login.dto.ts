import { IsEmail, Length } from 'class-validator';
import { LengthInput } from '../../constants';

export class LoginDTO {
  @IsEmail({}, { message: 'error.invalidEmail' })
  email: string;

  @Length(LengthInput.MIN_LENGTH, LengthInput.MAX_LENGTH, { message: 'error.passwordLengthError' })
  password: string;

  constructor(data: any) {
    this.email = data.email;
    this.password = data.password;
  }
}
