import { PagingResponse, SearchFilter } from '../../search/response';
import { CompanyEmployee } from '../../../company';

export interface EmployeeSearchResult extends CompanyEmployee {
  JobTitle: string;
}

export interface TotalRewardsEmployeeSearchResult {
  $type: string;
  $values: EmployeeSearchResult[];
}

export interface TotalRewardsEmployeeSearchResponse {
  EmployeeResults: TotalRewardsEmployeeSearchResult;
  SearchFilters: SearchFilter[];
  Paging: PagingResponse;
}
