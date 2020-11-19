import { GridDataResult } from '@progress/kendo-angular-grid';

import * as fromActions from '../actions';
import { GridConfig } from '../models';
import { PagingOptions } from '../../../models/payfactors-api/search/request';

export class GridDataHelper {
  static getLoadDataAction(pageViewId: string, gridData: GridDataResult, gridConfig: GridConfig, pagingOptions: PagingOptions) {
    if (gridData != null && gridConfig != null && pagingOptions != null && gridConfig.EnableInfiniteScroll) {
      let totalPages = Math.floor(gridData.data.length / pagingOptions.Count);
      if (totalPages === 0 || gridData.data.length % pagingOptions.Count !== 0) {
        totalPages++;
      }
      return new fromActions.ReloadData(pageViewId, totalPages * pagingOptions.Count);
    } else {
      return new fromActions.LoadData(pageViewId);
    }
  }
}
