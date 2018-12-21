import { UserRoleDto } from 'libs/models/admin';
import { UserAssignedRole } from 'libs/models/security';

export class UserRoleDtoToUserAssignedRoleMapper {

  static mapUserRoleDtoToUserAssignedRole(userRole: UserRoleDto): UserAssignedRole {
    return {
      DerivedId: userRole.RoleId,
      RoleName: userRole.RoleName,
      IsSystemRole: userRole.IsSystemRole,
      Assigned: false,
      Permissions: userRole.Permissions
    };
  }

  static mapUserAssignedRoleToUserRoleDto(userAssignedRole: UserAssignedRole): UserRoleDto {
    return {
      RoleId: userAssignedRole.DerivedId,
      RoleName: userAssignedRole.RoleName,
      IsSystemRole: userAssignedRole.IsSystemRole,
      CompanyId: 0,
      Permissions: userAssignedRole.Permissions
    };
  }
}
