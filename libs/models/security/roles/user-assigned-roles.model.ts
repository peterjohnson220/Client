import { RolePermission } from 'libs/models/security';

export class UserAssignedRole {
  RoleId: number;
  CompanyId: number;
  RoleName: string;
  IsSystemRole: boolean;
  Assigned: boolean;
  Permissions: RolePermission[];
}
export function generateMockUserAssignedRole(): UserAssignedRole {
  return {
    RoleId: 0,
    CompanyId: 0,
    RoleName: 'Test Role',
    IsSystemRole: false,
    Assigned: false,
    Permissions: []
  };
}
export function getMockUserAssignedRoleWithPermissions(): UserAssignedRole {
  return {
    RoleId: 0,
    CompanyId: 0,
    RoleName: 'Test Role',
    IsSystemRole: false,
    Assigned: false,
    Permissions: [
      {
        SystemPermissionId: 1,
        Permission: 'Parent_Permission',
        Name: 'Parent Permission',
        TileId: 1,
        IsParent: true,
        IsChecked: false,
        ChildPermission: null
      },
      {SystemPermissionId: 2,
        Permission: 'Sub1_Permission',
        Name: 'Sub1 Permission',
        TileId: 1,
        IsParent: true,
        IsChecked: false,
        ChildPermission: null},
      {
        SystemPermissionId: 3,
        Permission: 'Sub2_Permission',
        Name: 'Sub2 Permission',
        TileId: 1,
        IsParent: true,
        IsChecked: false,
        ChildPermission: null
      }
        ]
  };
}
