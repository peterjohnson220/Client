import { AggregateResult } from './aggregate-result.model';

export interface ListAreaResult {
  Count: number;
  Data: string;
  AggregateResults: AggregateResult[];
}
