import { Length } from 'class-validator';
import { LengthInput } from '../../constants';

export class CreateCategoryDTO {
  @Length(LengthInput.MIN_LENGTH, LengthInput.MAX_LENGTH, { message: 'error.nameLengthError' })
  name: string;

  constructor(data: any) {
    this.name = data.name;
  }
}
