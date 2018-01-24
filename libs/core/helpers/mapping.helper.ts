import { GridDataResult } from '@progress/kendo-angular-grid';

export class MappingHelper {
  static mapListAreaResultToGridDataResult(listAreaResult: any): GridDataResult {
    return {
      total: listAreaResult.Count,
      data: JSON.parse(listAreaResult.Data)
    };
  }
}
