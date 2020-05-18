import { GridDataResult } from '@progress/kendo-angular-grid';
import { AggregateGridDataResult, ListAreaColumn, ListAreaResult } from '../../models/common/list-area';
import { ListAreaColumnRequest } from '../../models/payfactors-api/user-profile/request/list-area-column-request.model';
import { ListAreaColumnResponse } from '../../models/payfactors-api/user-profile/response';
import { TileTypes } from '../../models/dashboard';

export class MappingHelper {
  static mapListAreaResultToGridDataResult(listAreaResult: any): GridDataResult {
    return {
      total: listAreaResult.Count,
      data: JSON.parse(listAreaResult.Data)
    };
  }
  static mapListAreaResultToAggregateGridDataResult(listAreaResult: ListAreaResult): AggregateGridDataResult {
    return {
      total: listAreaResult.Count,
      data: JSON.parse(listAreaResult.Data),
      aggregates: listAreaResult.AggregateResults
    };
  }

  static mapListAreaColumnToListAreaColumnRequest(request: ListAreaColumn): ListAreaColumnRequest {
    return {
      ListAreaColumnId: request.ListAreaColumnId,
      ColumnDatabaseName: request.ColumnDatabaseName,
      ColumnDisplayName: request.ColumnDisplayName,
      ColumnDataType: request.ColumnDataType,
      Visible: request.Visible,
      Order: request.Order,
      Default: request.Default,
      Required: request.Required,
      PublicView: request.PublicView
    };
  }

  static mapListAreaColumnListToListAreaColumnRequestList(request: ListAreaColumn[]): ListAreaColumnRequest[] {
    return request.map(lacr => {
      return this.mapListAreaColumnToListAreaColumnRequest(lacr);
    });
  }

  static mapListAreaColumnResponseToListAreaColumn(response: ListAreaColumnResponse): ListAreaColumn {
    return {
      ListAreaColumnId: response.ListAreaColumnId,
      ColumnDatabaseName: response.ColumnDatabaseName,
      ColumnDisplayName: response.ColumnDisplayName,
      ColumnDataType: response.ColumnDataType,
      Visible: response.Visible,
      Order: response.Order,
      Default: response.Default,
      Required: response.Required,
      DisableDropdown: false,
      PublicView: response.PublicView
    };
  }

  static mapListAreaColumnResponseListToListAreaColumnList(response: ListAreaColumnResponse[]): ListAreaColumn[] {
    return response.map(lacr => {
      return this.mapListAreaColumnResponseToListAreaColumn(lacr);
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
      case 'Data Diagnostics':
        return TileTypes.DataDiagnostics;
      case 'Community':
        return TileTypes.Community;
      case 'New Community':
        return TileTypes.NewCommunity;
      case 'Ideas':
        return TileTypes.Ideas;
      case 'Quick Price':
        return TileTypes.QuickPrice;
      case 'Total Rewards':
        return TileTypes.TotalRewards;
      case 'Data Management':
        return TileTypes.DataManagement;
      case 'International Data':
        return TileTypes.InternationalData;
      default:
        return TileTypes.Unknown;
    }
  }
}
