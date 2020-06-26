import { JobSearchResult } from './job-search-response.model';
import { GenericKeyValue } from '../../../common';
import { PagingResponse, SearchFilter } from '../../search/response';

export interface JobBasedRangeJobSearchResult extends JobSearchResult {
  Id: string;
  Base50Mrp: string;
  TccMrp: string;
  Grade: string[];
  EEO: string;
  IsMappedInPeerExchange: boolean;
  CompanyName: string;
  IsPayfactorsJob: boolean;
  CountryCodes: string[];
  UdfFields: GenericKeyValue<string, string>[];
  CompanyStructures?: string;
}

export interface JobBasedRangeJobSearchResponse {
  JobResults: JobSearchResult[];
  SearchFilters: SearchFilter[];
  Paging: PagingResponse;
}

