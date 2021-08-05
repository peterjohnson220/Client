import { GenericSearchRequest } from './generic-search-request.model';
export interface StatementListSearchRequest extends GenericSearchRequest {
  SearchTerm?: string;
}
