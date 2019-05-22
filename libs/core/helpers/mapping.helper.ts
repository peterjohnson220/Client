import { GridDataResult } from '@progress/kendo-angular-grid';
import { AggregateGridDataResult, ListAreaResult } from '../../models/common/list-area';
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
}
