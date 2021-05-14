export interface SidebarItem {
  Name: string;
  Value: string;
}

export interface SidebarGroup {
  Name: string;
  Items: SidebarItem[];
  DisplayEmptySetMessage: boolean;
  EmptySetMessage: string;
}
