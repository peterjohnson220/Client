export class RolePermission {
  Id: number;
  Name: string;
  TileId: number;
  IsParent: boolean;
  IsChecked: boolean;
  ChildPermission: RolePermission[];
}
