import {CompanyRolePermission} from '../security';

export interface UserRoleDto {
  RoleId: number;
  CompanyId: number;
  RoleName: string;
  IsSystemRole: boolean;
  Permissions: CompanyRolePermission[];
}
