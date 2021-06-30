export interface SidebarItem {
  Name: string;
  Value: string;
  IsImage?: boolean;
}

export interface SidebarGroup {
  Name: string;
  Items: SidebarItem[];
  DisplayEmptySetMessage: boolean;
  EmptySetMessage: string;
}
