import { PagingResponse, SearchFilter } from '../../search/response';
import { GenericKeyValue } from '../../../common';

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
  EEO: string;
  IsMappedInPeerExchange: boolean;
  CompanyName: string;
  IsPayfactorsJob: boolean;
  CountryCodes: string[];
  UdfFields: GenericKeyValue<string, string>[];
}

export interface JobSearchResponse {
  JobResults: JobSearchResult[];
  SearchFilters: SearchFilter[];
  Paging: PagingResponse;
}
