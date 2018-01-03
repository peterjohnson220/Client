import { Tile, TileTypes, TilePreviewTypes } from '../models';
import { UserTileDto } from '../../../../../../libs/models';

export class UserTileToTileMapper {

  static mapUserTileDtoToTile(dashboardTile: UserTileDto): Tile {
    return this.setTileStylesProperties({
      id: dashboardTile.UserTileId,
      label: dashboardTile.TileName,
      iconClass: dashboardTile.IconClass,
      url: dashboardTile.Url,
      order: dashboardTile.UserOrder,
      type: this.mapTileTypeFromTileName(dashboardTile.TileName),
      previewType:  this.mapTilePreviewTypeFromTileType(UserTileToTileMapper.mapTileTypeFromTileName(dashboardTile.TileName)),
      payload: undefined,
      size: 1,
      cssClass: undefined,
      ngAppLink: dashboardTile.NgAppLink
    });
  }

  static mapTileTypeFromTileName(tileName: string): TileTypes {
    switch (tileName) {
      case 'Employees':
        return TileTypes.Employees;
      case 'Data Insights':
        return TileTypes.DataInsights;
      case 'Job Descriptions':
        return TileTypes.JobDescriptions;
      case 'Jobs':
        return TileTypes.MyJobs;
      case 'Pay Markets':
        return TileTypes.PayMarkets;
      case 'Pricing Projects':
        return TileTypes.PricingProjects;
      case 'Resources':
        return TileTypes.Resources;
      case 'Service':
        return TileTypes.Service;
      case 'Structures':
        return TileTypes.Structures;
      case 'Surveys':
        return TileTypes.Surveys;
      default:
        return TileTypes.Unknown;
    }
  }

  static mapTilePreviewTypeFromTileType(tileType: TileTypes): TilePreviewTypes {
    switch (tileType) {
      case TileTypes.Employees:
      case TileTypes.JobDescriptions:
      case TileTypes.MyJobs:
        return TilePreviewTypes.Chart;

      case TileTypes.DataInsights:
      case TileTypes.PricingProjects:
      case TileTypes.Resources:
      case TileTypes.Surveys:
        return TilePreviewTypes.List;

      default:
        return TilePreviewTypes.Icon;
    }
  }

  static setTileStylesProperties(tile: Tile): Tile {
    switch (tile.type) {
      case TileTypes.DataInsights:
        tile.cssClass = 'tile-green';
        break;

      case TileTypes.Employees:
        tile.cssClass = 'tile-blue';
        break;

      case TileTypes.JobDescriptions:
        tile.cssClass = 'tile-green';
        break;

      case TileTypes.MyJobs:
        tile.cssClass = 'tile-lightblue';
        tile.size = 2;
        break;

      case TileTypes.PayMarkets:
        tile.cssClass = 'tile-blue';
        break;

      case TileTypes.PricingProjects:
        tile.cssClass = 'tile-lightblue';
        tile.size = 2;
        break;

      case TileTypes.Resources:
        tile.cssClass = 'tile-blue';
        break;

      case TileTypes.Service:
        tile.cssClass = 'tile-green';
        break;

      case TileTypes.Structures:
        tile.cssClass = 'tile-green';
        break;

      case TileTypes.Surveys:
        tile.cssClass = 'tile-blue';
        break;

      default:
        tile.cssClass = 'tile-green';
        tile.size = 1;
    }
    return tile;
  }
}
