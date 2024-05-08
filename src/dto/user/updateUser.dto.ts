import { IsEnum } from 'class-validator';
import { Role, EntityStatus } from '../../constants';

export class UpdateUserDTO {
  @IsEnum(Role, {message: 'error.roleInvalid'})
  role: Role;

  @IsEnum(EntityStatus, {message: 'error.statusInvalid'})
  isActive: EntityStatus;

  constructor(data: any) {
    this.role = data.role;
    this.isActive = data.isActive;
  }
}
