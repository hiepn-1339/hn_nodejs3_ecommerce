import { IsEnum } from 'class-validator';
import RegisterDTO from './register.dto';
import { Role, EntityStatus } from '../../constants';

export class CreateUserDTO extends RegisterDTO {
  @IsEnum(Role, {message: 'error.roleInvalid'})
  role: Role;

  @IsEnum(EntityStatus, {message: 'error.statusInvalid'})
  isActive: EntityStatus;

  constructor(data: any) {
    super(data);
    this.role = data.role;
    this.isActive = data.isActive;
  }
}
