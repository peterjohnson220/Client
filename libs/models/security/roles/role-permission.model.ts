export class SystemPermission {
  SystemPermissionId: number;
  Name: string;
  Permission: string;
}

export class  RolePermission extends SystemPermission {
  TileId: number;
  IsParent: boolean;
  IsChecked: boolean;
  ChildPermission: RolePermission[];
}




