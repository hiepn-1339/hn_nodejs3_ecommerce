import { IsEnum } from 'class-validator';
import { Role, UserStatus } from '../../constants';

export class UpdateUserDTO {
  @IsEnum(Role, {message: 'error.roleInvalid'})
  role: Role;

  @IsEnum(UserStatus, {message: 'error.statusInvalid'})
  isActive: UserStatus;

  constructor(data: any) {
    this.role = data.role;
    this.isActive = data.isActive;
  }
}
