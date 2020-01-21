export interface UserTileDto {
  UserTileId: number;
  TileId?: number;
  CompanyTileId?: number;
  UserId?: number;
  UserOrder?: number;
  Enabled?: boolean;
  Disabled?: boolean;
  CreateDate?: string;
  CreateUser?: number;
  TileName: string;
  TileDisplayName: string;
  IconClass: string;
  Url: string;
  Sidebar: boolean;
  NgAppLink: boolean;
  TilePreviewData: any;
  ChartType: string;
  MarketingEnabled: boolean;
}
