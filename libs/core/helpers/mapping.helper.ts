import { GridDataResult } from '@progress/kendo-angular-grid';
import { AggregateGridDataResult, ListAreaColumn, ListAreaResult } from '../../models/common/list-area';
import { ListAreaColumnRequest } from '../../models/payfactors-api/user-profile/request/list-area-column-request.model';
import { ListAreaColumnResponse } from '../../models/payfactors-api/user-profile/response';
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
}
