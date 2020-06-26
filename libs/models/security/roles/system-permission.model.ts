export class SystemPermission {
  SystemPermissionId: number;
  Name: string;
  Permission: string;
  TileId: number;
  IsParent: boolean;
  IsChecked: boolean;
  ChildPermission: SystemPermission[];
  UiVisible: boolean;
}




