import { UserRoleDto } from 'libs/models/admin';
import { UserAssignedRole } from 'libs/models/security';

export class UserRoleDtoToUserAssignedRoleMapper {

  static mapUserRoleDtoToUserAssignedRole(userRole: UserRoleDto): UserAssignedRole {
    return {
      DerivedId: userRole.CompanyRoleId,
      RoleName: userRole.RoleName,
      RoleType: 'C',
      Assigned: false,
      Permissions: null
    };
  }

  static mapUserAssignedRoleToUserRoleDto(userAssignedRole: UserAssignedRole): UserRoleDto {
    return {
      CompanyRoleId: userAssignedRole.DerivedId,
      RoleName: userAssignedRole.RoleName,
      CompanyId: 0
    };
  }
}
