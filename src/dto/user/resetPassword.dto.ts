import { Length, ValidatorConstraint, ValidatorConstraintInterface, Validate, ValidationArguments } from 'class-validator';
import { LengthInput } from '../../constants';

@ValidatorConstraint({ name: 'isPasswordMatch', async: false })
class IsPasswordMatch implements ValidatorConstraintInterface {
  validate(passwordConfirm: string, args: ValidationArguments) {
    const password = args.object['password'];
    return password === passwordConfirm;
  }

  defaultMessage() {
    return 'error.passwordsDoNotMatchPasswordConfirm';
  }
}

class ResetPasswordDTO {
  @Length(LengthInput.MIN_LENGTH, LengthInput.MAX_LENGTH, { message: 'error.passwordLengthError' })
  password: string;

  @Validate(IsPasswordMatch)
  confirmPassword: string;

  constructor(data: any) {
    this.password = data.password;
    this.confirmPassword = data.confirmPassword;
  }
}

export default ResetPasswordDTO;
