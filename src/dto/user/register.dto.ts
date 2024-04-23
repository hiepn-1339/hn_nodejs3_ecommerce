import { IsEmail, Length, ValidatorConstraint, ValidatorConstraintInterface, Validate, ValidationArguments } from 'class-validator';

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
  @Length(6, 10, { message: 'error.nameLengthError' })
  name: string;

  @Length(6, 20, { message: 'error.passwordLengthError' })
  password: string;

  @Validate(IsPasswordMatch)
  confirmPassword: string;

  @Validate(IsBeforeCurrentDate)
  dateOfBirth: Date;

  @Length(8, 20, { message: 'error.phoneLengthError' })
  phone: string;

  @IsEmail({}, { message: 'error.invalidEmail' })
  email: string;

  @Length(1, 255, { message: 'error.addressLengthError' })
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
