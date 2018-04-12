import { Tile, TileTypes, TilePreviewTypes } from '../models';
import { UserTileDto } from '../../../../../../libs/models';
import { TilePreviewChartTypes } from '../models/tile-preview-chart-types';

export class UserTileToTileMapper {

  static mapUserTileDtoToTile(dashboardTile: UserTileDto): Tile {
    return this.setTileStylesProperties({
      Id: dashboardTile.UserTileId,
      Label: dashboardTile.TileName,
      IconClass: dashboardTile.IconClass,
      Url: dashboardTile.Url,
      Order: dashboardTile.UserOrder,
      Type: this.mapTileTypeFromTileName(dashboardTile.TileName),
      PreviewType: this.mapTilePreviewTypeFromTileType(UserTileToTileMapper.mapTileTypeFromTileName(dashboardTile.TileName)),
      TilePreviewData: dashboardTile.TilePreviewData,
      Size: 1,
      ChartType: undefined,
      ChartLabel: undefined,
      CssClass: undefined,
      NgAppLink: dashboardTile.NgAppLink
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
      case 'Peer':
        return TileTypes.Peer;
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
      case TileTypes.Surveys:
        return TilePreviewTypes.Chart;
      case TileTypes.PricingProjects:
        return TilePreviewTypes.List;
      case TileTypes.MyJobs:
        return TilePreviewTypes.ChartWithCalendar;

      default:
        return TilePreviewTypes.Icon;
    }
  }

  static setTileStylesProperties(tile: Tile): Tile {
    switch (tile.Type) {
      case TileTypes.DataInsights:
        tile.CssClass = 'tile-green';
        break;

      case TileTypes.Employees:

        tile.CssClass = 'tile-blue';

        if (tile.TilePreviewData == null || tile.TilePreviewData[ 0 ] == null) {
          tile.PreviewType = TilePreviewTypes.Icon;
        } else {
          tile.ChartType = TilePreviewChartTypes.Donut;
          tile.ChartLabel = 'Market Index';
          tile.ShouldLimitLegendText = false;

          this.SetChartLegendColor(tile, '<90%', '#C79500');
          this.SetChartLegendColor(tile, '90-110%', '#EEB200');
          this.SetChartLegendColor(tile, '>110%', '#FEC968');
          this.SetChartLegendColor(tile, 'Not Available', '#FEDCAC');
        }

        break;

      case TileTypes.JobDescriptions:
        tile.CssClass = 'tile-green';
        tile.ChartType = TilePreviewChartTypes.Donut;
        tile.ChartLabel = 'Job Description Status';
        tile.ShouldLimitLegendText = false;

        this.SetChartLegendColor(tile, 'Not Started', '#4472C3');
        this.SetChartLegendColor(tile, 'Draft', '#A3A3A3');
        this.SetChartLegendColor(tile, 'Published', '#5A99D3');
        this.SetChartLegendColor(tile, 'In Review', '#264478');
        break;

      case TileTypes.MyJobs:
        tile.CssClass = 'tile-lightblue';
        tile.ChartType = TilePreviewChartTypes.Donut;
        tile.ChartLabel = 'jobs';
        tile.Size = 2;

        const NotPricedCategory = tile.TilePreviewData.length > 0
          ? tile.TilePreviewData[ 0 ].TileRightPart.ChartData.filter(x => x.Key === 'Not Priced') : null;

        if (NotPricedCategory.length > 0) {
          NotPricedCategory[ 0 ].color = '#FFCA69';
        }

        const PricedCategory = tile.TilePreviewData.length > 0
          ? tile.TilePreviewData[ 0 ].TileRightPart.ChartData.filter(x => x.Key === 'Priced') : null;

        if (PricedCategory.length > 0) {
          PricedCategory[ 0 ].color = '#EFB300';
        }

        break;

      case TileTypes.PayMarkets:
        tile.CssClass = 'tile-blue';
        tile.IconClass = 'fas fa-home';
        break;

      case TileTypes.Peer:
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

        if (tile.TilePreviewData == null || tile.TilePreviewData[ 0 ] == null) {
          tile.PreviewType = TilePreviewTypes.Icon;
        } else {
          tile.ChartType = TilePreviewChartTypes.Pie;
          tile.ChartLabel = 'Top Surveys';
          tile.ShouldLimitLegendText = true;
          this.SetChartLegendColors(tile, [ '#C79500', '#EEB200', '#FEC968', '#FEDCAC' ]);
        }

        break;

      default:
        tile.CssClass = 'tile-green';
        tile.Size = 1;

    }
    return tile;
  }

  static SetChartLegendColor(tile: Tile, categoryName, color) {
    const chartCategory = tile.TilePreviewData.filter(x => x.CategoryName === categoryName);
    if (chartCategory.length > 0) {
      chartCategory[ 0 ].color = color;
    }
  }

  static SetChartLegendColors(tile: Tile, colors: string[]) {
    let j = 0;
    for (let i = 0; i < tile.TilePreviewData.length; i++) {
      if ((j + 1) === colors.length) {
        j = 0;
      } else {
        j++;
      }
      const chartCategory = tile.TilePreviewData[ i ];
      chartCategory.color = colors[ j ];
    }
  }

}
