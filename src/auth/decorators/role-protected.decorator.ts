import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../constants/valid-roles.constant';

export const ROLES = 'roles';

export const RoleProtected = (...roles: ValidRoles[]) =>
  SetMetadata(ROLES, roles);
