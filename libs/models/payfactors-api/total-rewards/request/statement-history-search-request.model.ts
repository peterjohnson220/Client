import { GenericSearchRequest } from './generic-search-request.model';

export interface StatementHistorySearchRequest extends GenericSearchRequest {
  StatementId: string;
}
