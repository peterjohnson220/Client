import { Tile, TileTypes } from '../models';
import { UserTileDto } from '../../../../../../libs/models';
import { TilePreviewTypes } from '../models/tile-preview-types';

export class TileMapper {

  static mapUserTileDtoToTile(dashboardTile: UserTileDto): Tile {
    const tile = {
      Id: dashboardTile.UserTileId,
      Label: dashboardTile.TileName,
      IconClass: dashboardTile.IconClass,
      Url: dashboardTile.Url,
      Order: dashboardTile.UserOrder,
      Type: TileMapper.mapTileNameToTileType(dashboardTile.TileName),
      PreviewType:  TileMapper.mapTileTypeToTileContentType(TileMapper.mapTileNameToTileType(dashboardTile.TileName)),
      Payload: undefined,
      Size: 1,
      CssClass: undefined
    };
    return this.mapTileStylesFromTileType(tile);
  }

  static mapTileNameToTileType(label: string): TileTypes {
    switch (label) {
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

  static mapTileTypeToTileContentType(tileType: TileTypes): TilePreviewTypes {
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

  static mapTileStylesFromTileType(tile: Tile): Tile {
    switch (tile.Type) {
      case TileTypes.DataInsights:
        tile.CssClass = 'tileGreen';
        break;

      case TileTypes.Employees:
        tile.CssClass = 'tileBlue';
        break;

      case TileTypes.JobDescriptions:
        tile.CssClass = 'tileGreen';
        break;

      case TileTypes.MyJobs:
        tile.CssClass = 'tileLightBlue';
        tile.Size = 2;
        break;

      case TileTypes.PayMarkets:
        tile.CssClass = 'tileBlue';
        break;

      case TileTypes.PricingProjects:
        tile.CssClass = 'tileLightBlue';
        tile.Size = 2;
        break;

      case TileTypes.Resources:
        tile.CssClass = 'tileBlue';
        break;

      case TileTypes.Service:
        tile.CssClass = 'tileGreen';
        break;

      case TileTypes.Structures:
        tile.CssClass = 'tileGreen';
        break;

      case TileTypes.Surveys:
        tile.CssClass = 'tileBlue';
        break;

      default:
        tile.CssClass = 'tileGreen';
        tile.Size = 1;
    }
    return tile;
  }
}
