import { IsEnum } from 'class-validator';
import RegisterDTO from './register.dto';
import { Role, UserStatus } from '../../constants';

export class CreateUserDTO extends RegisterDTO {
  @IsEnum(Role, {message: 'error.roleInvalid'})
  role: Role;

  @IsEnum(UserStatus, {message: 'error.statusInvalid'})
  isActive: UserStatus;

  constructor(data: any) {
    super(data);
    this.role = data.role;
    this.isActive = data.isActive;
  }
}
