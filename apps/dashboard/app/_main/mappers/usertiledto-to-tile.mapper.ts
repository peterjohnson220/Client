import { TileTypes, UserTileDto } from 'libs/models';
import { MappingHelper } from 'libs/core/helpers';

import { Tile, TilePreviewChartTypes, TilePreviewTypes } from '../models';
import { MarketingTileDescriptions } from '../models/marketing-tile-descriptions';

export class UserTileToTileMapper {

  static mapUserTileDtoToTile(dashboardTile: UserTileDto): Tile {
    return this.setTileStylesProperties({
      Id: dashboardTile.UserTileId,
      Label: dashboardTile.TileDisplayName,
      IconClass: dashboardTile.IconClass,
      Url: dashboardTile.Url,
      Order: dashboardTile.UserOrder,
      Type: MappingHelper.mapTileTypeFromTileName(dashboardTile.TileName),
      PreviewType: this.mapTilePreviewTypeFromTileType(MappingHelper.mapTileTypeFromTileName(dashboardTile.TileName)),
      TilePreviewData: dashboardTile.TilePreviewData,
      Size: 1,
      ChartType: undefined,
      ChartLabel: undefined,
      CssClass: undefined,
      NgAppLink: dashboardTile.NgAppLink,
      MarketingEnabled: dashboardTile.MarketingEnabled,
      MarketingDescription: '',
      MarketingButtonText: ''
    });
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
      case TileTypes.NewCommunity:
        return TilePreviewTypes.ChartWithList;
      case TileTypes.QuickPrice:
        return TilePreviewTypes.BasicList;
      case TileTypes.Peer:
        return TilePreviewTypes.Peer;
      case TileTypes.TotalRewards:
        return TilePreviewTypes.TotalRewards;
      case TileTypes.WhatIsNew:
        return TilePreviewTypes.WhatIsNew;
      default:
        return TilePreviewTypes.Icon;
    }
  }

  static setTileStylesProperties(tile: Tile): Tile {
    switch (tile.Type) {
      case TileTypes.DataInsights:
        tile.CssClass = 'tile-green';
        tile.MarketingDescription = MarketingTileDescriptions.DataInsights;
        tile.MarketingButtonText = 'EXPLORE';
        break;

      case TileTypes.Employees:
        tile.CssClass = 'tile-blue';
        tile.MarketingDescription = MarketingTileDescriptions.Employees;
        tile.MarketingButtonText = 'TAKE A LOOK';

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
        tile.MarketingDescription = MarketingTileDescriptions.JobDescriptions;
        tile.MarketingButtonText = 'TAKE A LOOK';

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
        tile.MarketingDescription = MarketingTileDescriptions.Jobs;
        tile.MarketingButtonText = 'EXPLORE';

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
        tile.MarketingDescription = MarketingTileDescriptions.PayMarkets;
        tile.MarketingButtonText = 'LEARN MORE';
        break;

      case TileTypes.Peer:
        tile.CssClass = 'tile-blue';
        tile.MarketingDescription = MarketingTileDescriptions.Peer;
        tile.MarketingButtonText = 'EXPLORE';
        const hasPeerData = !!tile.TilePreviewData && !!tile.TilePreviewData[0].ExchangePreviewModels && tile.TilePreviewData[0].ExchangePreviewModels.length;

        if (!hasPeerData) {
          tile.PreviewType = TilePreviewTypes.Icon;
          tile.TilePreviewData = null;
        } else {
          tile.Size = 2;
          tile.IgnoreTileAnchorOverlay = true;
          tile.ChartType = TilePreviewChartTypes.Pie;
          tile.ChartLabel = 'Company Jobs';
          tile.ShouldLimitLegendText = true;
          this.SetChartLegendColors(tile, [ '#A3A3A3', '#264478', '#C79500' ]);
        }
        break;

      case TileTypes.PricingProjects:
        tile.CssClass = 'tile-lightblue';
        tile.MarketingDescription = MarketingTileDescriptions.PricingProjects;
        tile.MarketingButtonText = 'CHECK IT OUT';
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
        tile.MarketingDescription = MarketingTileDescriptions.Structures;
        tile.MarketingButtonText = 'EXPLORE';
        break;

      case TileTypes.Surveys:
        tile.CssClass = 'tile-blue';
        tile.MarketingDescription = MarketingTileDescriptions.SurveyManagement;
        tile.MarketingButtonText = 'CHECK IT OUT';

        if (tile.TilePreviewData == null || tile.TilePreviewData[ 0 ] == null) {
          tile.PreviewType = TilePreviewTypes.Icon;
        } else {
          tile.ChartType = TilePreviewChartTypes.Pie;
          tile.ChartLabel = 'Top Surveys';
          tile.ShouldLimitLegendText = true;
          this.SetChartLegendColors(tile, [ '#C79500', '#EEB200', '#FEC968', '#FEDCAC' ]);
        }

        break;
      case TileTypes.DataDiagnostics:
          tile.CssClass = 'tile-green';
          break;

      case TileTypes.Community:
          tile.CssClass = 'tile-lightblue';
          break;

      case TileTypes.NewCommunity:
        tile.CssClass = 'tile-lightblue';
        break;

      case TileTypes.Ideas:
          tile.CssClass = 'tile-lightblue';
          break;

      case TileTypes.TotalRewards:
          tile.CssClass = 'tile-blue';
          tile.PreviewType = tile.TilePreviewData.length !== 0 ? tile.PreviewType : TilePreviewTypes.Icon;
          tile.Label = tile.TilePreviewData.length !== 0 ? 'Total Reward Statements' : tile.Label;
          tile.MarketingDescription = MarketingTileDescriptions.TotalRewards;
          tile.MarketingButtonText = 'LEARN MORE';
          break;

      case TileTypes.InternationalData:
        tile.CssClass = 'tile-green';
        tile.MarketingDescription = MarketingTileDescriptions.InternationalData;
        tile.MarketingButtonText = 'EXPLORE';
        break;

      case TileTypes.WhatIsNew:
        tile.CssClass = 'tile-lightblue';
        tile.IgnoreTileAnchorOverlay = true;
        tile.MarketingButtonText = 'LEARN MORE';
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
