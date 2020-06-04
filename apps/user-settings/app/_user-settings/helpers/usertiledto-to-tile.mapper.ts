import { UserTileDto } from 'libs/models';
import { MappingHelper } from 'libs/core/helpers';
import { UserTile } from '../models';


export class UserTileToTileMapper {

  static mapUserTileDtoToTile(dashboardTile: UserTileDto): UserTile {
    return {
      UserTileId: dashboardTile.UserTileId,
      Label: dashboardTile.TileDisplayName,
      Type: MappingHelper.mapTileTypeFromTileName(dashboardTile.TileName),
      MarketingEnabled: dashboardTile.MarketingEnabled,
      HideOnDashboard: dashboardTile.HideOnDashboard,
      Dirty: false
    };
  }
}
