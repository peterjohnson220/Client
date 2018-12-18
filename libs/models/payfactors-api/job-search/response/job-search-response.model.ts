import { PagingResponse, SearchFilter } from '../../search/response';

interface BaseJobSearchResult {
  Title: string;
  Code: string;
  Family: string;
  Description: string;
  EditDate?: Date;
  FLSAStatus: string;
  Category: string;
  Level: string;
}

export interface JobSearchResult extends BaseJobSearchResult {
  Id: string;
  Base50Mrp: number;
  TccMrp: number;
  Grade: string;
  IsMappedInPeerExchange: boolean;
  CompanyName: string;
  IsPayfactorsJob: boolean;
  CountryCodes: string[];
  UdfFields: {[key: string]: string}[];
}

export interface JobSearchResponse {
  JobResults: JobSearchResult[];
  SearchFilters: SearchFilter[];
  Paging: PagingResponse;
}
