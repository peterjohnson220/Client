import {CompanyRolePermission} from './company-role-permission.model';
export class UserAssignedRole {
  DerivedId: number;
  RoleName: string;
  IsSystemRole: boolean;
  Assigned: boolean;
  Permissions: CompanyRolePermission[];
}
export function generateMockUserAssignedRole(): UserAssignedRole {
  return {
    DerivedId: 0,
    RoleName: 'Test Role',
    IsSystemRole: false,
    Assigned: false,
    Permissions: null
  };
}
export function getMockUserAssignedRoleWithPermissions(): UserAssignedRole {
  return {
    DerivedId: 1,
    RoleName: 'TestName',
    IsSystemRole: false,
    Assigned: false,
    Permissions: [
      {Id: 1,
        Name: 'Parent Permission',
        TileId: 1,
        IsParent: true,
        IsChecked: false,
        ChildPermission: null
      },
      {Id: 2,
        Name: 'Sub1 Permission',
        TileId: 1,
        IsParent: true,
        IsChecked: false,
        ChildPermission: null},
      {Id: 3,
        Name: 'Sub2 Permission',
        TileId: 1,
        IsParent: true,
        IsChecked: false,
        ChildPermission: null
      }
        ]
  };
}
