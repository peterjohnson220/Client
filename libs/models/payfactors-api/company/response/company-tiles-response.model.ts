export interface CompanyTilesResponse {
  Checked: boolean;
  CompanyId?: number;
  CompanyTileId?: number;
  CreateDate?: Date;
  CreateUser?: number;
  TileId: number;
  TileName: string;
  TileDisplayName: string;
  Disabled?: boolean;
  IsMarketingTile?: boolean;
  MarketingEnabled?: boolean;
}
