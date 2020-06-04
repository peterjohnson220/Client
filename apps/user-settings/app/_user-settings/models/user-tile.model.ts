import { TileTypes } from 'libs/models/dashboard/tile-type';


export interface UserTile {
  UserTileId: number;
  Label: string;
  Type: TileTypes;
  MarketingEnabled: boolean;
  HideOnDashboard: boolean;
  Dirty: boolean;
}

export function generateMockUserTile(): UserTile {
  return {
    UserTileId: 1,
    Label: 'Data Insights',
    Type: TileTypes.DataInsights,
    MarketingEnabled: false,
    HideOnDashboard: false,
    Dirty: false
  };
}
