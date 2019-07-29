import { DataFilterRequest } from './data-filter-request.model';

export interface ExchangeDataFilterRequest extends DataFilterRequest {
  ExchangeJobId: number;
}
