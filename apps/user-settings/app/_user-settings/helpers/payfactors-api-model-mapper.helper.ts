
import { UserTileDto } from 'libs/models/dashboard';
import { UserTile } from '../models';

export class PayfactorsApiModelMapper {
  static buildSaveDashboardPreferencesRequest(userTiles: UserTile[]): UserTileDto[] {
    return userTiles.map(ut => {
      return {
        UserTileId: ut.UserTileId,
        TileName: ut.Label,
        TileDisplayName: ut.Label,
        IconClass: '',
        Url: '',
        Sidebar: false,
        NgAppLink: false,
        SidebarNew: false,
        TileClassName: '',
        IconClassNew: '',
        MarketingEnabled: ut.MarketingEnabled,
        HideOnDashboard: ut.HideOnDashboard
      };
    });
  }
}
