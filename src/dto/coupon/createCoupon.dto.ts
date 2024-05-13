import { IsNotEmpty, Length, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { LengthInput } from '../../constants';

@ValidatorConstraint({ name: 'isPercentage', async: false })
class IsPercentage implements ValidatorConstraintInterface {
  validate(percentage: string) {
    const percentageNumber = parseFloat(percentage);

    if (isNaN(percentageNumber) || percentageNumber < 0 || percentageNumber > 100) return false;
    return true;
  }

  defaultMessage() {
    return 'error.percentageInvalid';
  }
}

@ValidatorConstraint({ name: 'isBeforeEndDate', async: false })
class IsBeforeEndDate implements ValidatorConstraintInterface {
  validate(startDate: string, args: ValidationArguments) {
    const endDate = new Date((args.object as CreateCouponDTO).endDate);
    return new Date(startDate) < endDate;
  }

  defaultMessage() {
    return 'error.startDateMustBeBeforeEndDate';
  }
}

@ValidatorConstraint({ name: 'isAfterStartDate', async: false })
class IsAfterStartDate implements ValidatorConstraintInterface {
  validate(endDate: string, args: ValidationArguments) {
    const startDate = new Date((args.object as CreateCouponDTO).startDate);
    return new Date(endDate) > startDate;
  }

  defaultMessage() {
    return 'error.endDateMustBeAfterStartDate';
  }
}

@ValidatorConstraint({ name: 'isAfterCurrentDate', async: false })
class IsAfterCurrentDate implements ValidatorConstraintInterface {
  validate(date: string) {
    const currentDate = new Date();
    return new Date(date) > currentDate;
  }

  defaultMessage() {
    return 'error.dateMustBeAfterCurrentDate';
  }
}

export class CreateCouponDTO {
  @Length(LengthInput.MIN_LENGTH, LengthInput.MAX_LENGTH, { message: 'error.nameLengthError' })
  @IsNotEmpty({ message: 'error.nameLengthError'})
  name: string;

  @Validate(IsPercentage)
  @IsNotEmpty({ message: 'error.percentageMustBeNotEmpty' })
  percentage: number;

  @Validate(IsBeforeEndDate)
  @Validate(IsAfterCurrentDate)
  @IsNotEmpty({ message: 'error.startDateMustBeNotEmpty' })
  startDate: Date;

  @Validate(IsAfterStartDate)
  @Validate(IsAfterCurrentDate)
  @IsNotEmpty({ message: 'error.endDateMustBeNotEmpty' })
  endDate: Date;

  constructor (data: any) {
    this.name = data.name;
    this.percentage = data.percentage;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
  }
}
