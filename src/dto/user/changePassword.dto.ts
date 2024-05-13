import { Length, ValidatorConstraint, ValidatorConstraintInterface, Validate, ValidationArguments } from 'class-validator';
import { LengthInput } from '../../constants';

@ValidatorConstraint({ name: 'isPasswordMatch', async: false })
class IsPasswordMatch implements ValidatorConstraintInterface {
  validate(newPasswordConfirm: string, args: ValidationArguments) {
    const newPassword = args.object['newPassword'];
    return newPassword === newPasswordConfirm;
  }

  defaultMessage() {
    return 'error.passwordsDoNotMatchPasswordConfirm';
  }
}

class ChangePasswordDTO{
  @Length(LengthInput.MIN_LENGTH, LengthInput.MAX_LENGTH, { message: 'error.passwordLengthError' })
  oldPassword: string;

  @Length(LengthInput.MIN_LENGTH, LengthInput.MAX_LENGTH, { message: 'error.passwordLengthError' })
  newPassword: string;

  @Validate(IsPasswordMatch)
  newPasswordConfirm: string;

  constructor(data: any) {
    this.oldPassword = data.oldPassword;
    this.newPassword = data.newPassword;
    this.newPasswordConfirm = data.newPasswordConfirm;
  }
}

export default ChangePasswordDTO;
