import { IsEmail, Length, ValidatorConstraint, ValidatorConstraintInterface, Validate, ValidationArguments } from 'class-validator';
import { LengthInput } from '../../constants';

@ValidatorConstraint({ name: 'isBeforeCurrentDate', async: false })
class IsBeforeCurrentDate implements ValidatorConstraintInterface {
  validate(dateOfBirth: string) {
    const currentDate = new Date();
    const dob = new Date(dateOfBirth);
    return dob < currentDate;
  }

  defaultMessage() {
    return 'error.dateOfBirthMustBeBeforeCurrentDate';
  }
}

@ValidatorConstraint({ name: 'isPasswordMatch', async: false })
class IsPasswordMatch implements ValidatorConstraintInterface {
  validate(password: string, args: ValidationArguments) {
    const passwordConfirm = args.object[args.property + 'Confirm'];
    return password === passwordConfirm;
  }

  defaultMessage() {
    return 'error.passwordsDoNotMatchPasswordConfirm';
  }
}

class RegisterDTO {
  @Length(LengthInput.MIN_LENGTH, LengthInput.MAX_LENGTH, { message: 'error.nameLengthError' })
  name: string;

  @Length(LengthInput.MIN_LENGTH, LengthInput.MAX_LENGTH, { message: 'error.passwordLengthError' })
  password: string;

  @Validate(IsPasswordMatch)
  confirmPassword: string;

  @Validate(IsBeforeCurrentDate)
  dateOfBirth: Date;

  @Length(LengthInput.MIN_LENGTH, LengthInput.MAX_LENGTH, { message: 'error.phoneLengthError' })
  phone: string;

  @IsEmail({}, { message: 'error.invalidEmail' })
  email: string;

  @Length(LengthInput.MIN_LENGTH_TEXT, LengthInput.MAX_LENGTH_TEXT, { message: 'error.addressLengthError' })
  address: string;

  constructor(data: any) {
    this.name = data.name;
    this.password = data.password;
    this.confirmPassword = data.confirmPassword;
    this.dateOfBirth = data.dateOfBirth;
    this.email = data.email;
    this.phone = data.phone;
    this.address = data.address;
  }
}

export default RegisterDTO;
