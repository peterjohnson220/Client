import { Tile, TileTypes } from '../models';
import { UserTileDto } from '../../../../../../libs/models';
import { TilePreviewTypes } from '../models/tile-preview-types';
import { TilePreviewChartTypes } from '../models/tile-preview-chart-types';


export class TileMapper {

  static mapUserTileDtoToTile(dashboardTile: UserTileDto): Tile {
    const tile = {
      Id: dashboardTile.UserTileId,
      Label: dashboardTile.TileName,
      IconClass: dashboardTile.IconClass,
      Url: dashboardTile.Url,
      Order: dashboardTile.UserOrder,
      Type: TileMapper.mapTileNameToTileType(dashboardTile.TileName),
      PreviewType: TileMapper.mapTileTypeToTileContentType(TileMapper.mapTileNameToTileType(dashboardTile.TileName)),
      Payload: dashboardTile.Payload,
      Size: 1,
      ChartType: undefined,
      ChartLabel: undefined,
      CssClass: undefined,
      NgAppLink: dashboardTile.NgAppLink
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
        tile.CssClass = 'tile-green';
        break;

      case TileTypes.Employees:
        tile.CssClass = 'tile-blue';
        break;

      case TileTypes.JobDescriptions:
        tile.CssClass = 'tile-green';
        tile.ChartType = TilePreviewChartTypes.donut;
        tile.ChartLabel = 'Job Description Statuses';

        this.SetChartLegendColor(tile, 'Not Started', '#4472C3');
        this.SetChartLegendColor(tile, 'Draft', '#A3A3A3');
        this.SetChartLegendColor(tile, 'Published', '#5A99D3');
        this.SetChartLegendColor(tile, 'In Review', '#264478');
        break;

      case TileTypes.MyJobs:
        tile.CssClass = 'tile-lightblue';
        tile.Size = 2;
        break;

      case TileTypes.PayMarkets:
        tile.CssClass = 'tile-blue';
        break;

      case TileTypes.PricingProjects:
        tile.CssClass = 'tile-lightblue';
        tile.Size = 2;
        break;

      case TileTypes.Resources:
        tile.CssClass = 'tile-blue';
        break;

      case TileTypes.Service:
        tile.CssClass = 'tile-green';
        break;

      case TileTypes.Structures:
        tile.CssClass = 'tile-green';
        break;

      case TileTypes.Surveys:
        tile.CssClass = 'tile-blue';
        break;

      default:
        tile.CssClass = 'tile-green';
        tile.Size = 1;
    }
    return tile;
  }

  static SetChartLegendColor(tile: Tile, categoryName, color) {
    const chartCategory = tile.Payload.filter(x => x.CategoryName === categoryName);
    if (chartCategory.length > 0) {
      chartCategory[ 0 ].color = color;
    }
  }
}
