import { TileTypes } from 'libs/models/dashboard';

export interface SaveDashboardPreferencesRequestModel {
  UserTileId: number;
  Label: String;
  Type: TileTypes;
  MarketingEnabled: boolean;
  HideOnDashboard: boolean;
}
