import { SystemPermission } from 'libs/models/security';
import { RoleDataRestriction } from './role-data-restriction.model';

export class UserAssignedRole {
  RoleId: number;
  CompanyId: number;
  RoleName: string;
  IsSystemRole: boolean;
  Assigned: boolean;
  Permissions: SystemPermission[];
  DataRestrictions: RoleDataRestriction[];
}

export interface UserRole {
  Id: number;
  CompanyId: number;
  RoleName: string;
  IsSystemRole: boolean;
  UiVisible: boolean;
}

export function generateMockUserAssignedRole(): UserAssignedRole {
  return {
    RoleId: 0,
    CompanyId: 0,
    RoleName: 'Test Role',
    IsSystemRole: false,
    Assigned: false,
    Permissions: [],
    DataRestrictions: []
  };
}

export function generateMockSystemDefinedUserAssignedRole(): UserAssignedRole {
  return {
    RoleId: 0,
    CompanyId: 0,
    RoleName: 'Test Role',
    IsSystemRole: true,
    Assigned: false,
    Permissions: [],
    DataRestrictions: []
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
        ChildPermission: null,
        UiVisible: true
      },
      {
        SystemPermissionId: 2,
        Permission: 'Sub1_Permission',
        Name: 'Sub1 Permission',
        TileId: 1,
        IsParent: true,
        IsChecked: false,
        ChildPermission: null,
        UiVisible: true
      },
      {
        SystemPermissionId: 3,
        Permission: 'Sub2_Permission',
        Name: 'Sub2 Permission',
        TileId: 1,
        IsParent: true,
        IsChecked: false,
        ChildPermission: null,
        UiVisible: true
      }
    ],
    DataRestrictions: []
  };
}
