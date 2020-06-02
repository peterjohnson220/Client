import { PagingResponse, SearchFilter } from 'libs/models/payfactors-api/search/response';
import { CompanyEmployee } from 'libs/models/company';

export interface EmployeeSearchResult extends CompanyEmployee {
  JobTitle: string;
  IsSelected: boolean;
}

export interface TotalRewardsEmployeeSearchResponse {
  EmployeeResults: EmployeeSearchResult[];
  SearchFilters: SearchFilter[];
  Paging: PagingResponse;
}
