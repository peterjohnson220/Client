import { GridDataResult } from '@progress/kendo-angular-grid';
import { AggregateResult } from './aggregate-result.model';

export interface AggregateGridDataResult extends GridDataResult {
  aggregates: AggregateResult[];
}
