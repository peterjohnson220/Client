export interface UserTileDto {
  UserTileId: number;
  TileId?: number;
  UserOrder?: number;
  Enabled?: boolean;
  Disabled?: boolean;
  TileName: string;
  TileDisplayName: string;
  IconClass: string;
  Url: string;
  Sidebar: boolean;
  NgAppLink: boolean;
  SidebarNew: boolean;
  TileClassName: string;
  IconClassNew: string;
  TilePreviewData?: any;
  ChartType?: string;
  MarketingEnabled: boolean;
  HideOnDashboard: boolean;
}
