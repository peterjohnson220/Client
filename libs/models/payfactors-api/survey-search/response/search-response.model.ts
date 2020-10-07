import { generateMockSearchFilter, SearchFilter, PagingResponse } from '../../search';
import { SurveySearchResultDataSources } from '../../../../constants';

export interface SurveyJob {
  Id: string;
  DataSource: SurveySearchResultDataSources;
  Survey: Survey;
  Job: Job;
}

export interface MatchedSurveyJob extends SurveyJob {
  DataCutsCount?: number;
  Paymarket?: string;
  PaymarketId?: number;
  CompanyJobId?: number;
  LinkedPaymarketId?: number;
}

interface Survey {
  Id: string;
  Publisher: string;
  Title: string;
  EffectiveDateTime: Date;
}

interface Job {
  Title: string;
  Code: string;
  Family: string;
  Level: string;
  Description: string;
  FLSAStatus?: string;
  Category?: string;
  Incs: number;
  Orgs: number;
  Base50th: number;
  TCC50th: number;
  CountryCode?: string;
  EEO: string;
  ExchangeId?: number;
  ExchangeJobId?: number;
}

export interface SearchResponse {
  SurveyJobs: SurveyJob[];
  Paging: PagingResponse;
  SearchFilters: SearchFilter[];
}

export function generateMockSurveyJob(): SurveyJob {
  return {
    Id: '12345',
    DataSource: SurveySearchResultDataSources.Surveys,
    Survey: {
      Id: '1693',
      Publisher: 'Towers Watson',
      Title: 'Executive Survey',
      EffectiveDateTime: new Date()
    },
    Job: {
      Title: 'Accountant',
      Code: '1001',
      Family: 'Finance',
      Level: 'I',
      Description: 'Lorem Ipsum',
      FLSAStatus: 'Typically Exempt',
      Category: 'Professional',
      Incs: 25,
      Orgs: 5,
      Base50th: 1,
      TCC50th: 1,
      CountryCode: 'USA',
      EEO: 'Yes'
    }
  };
}

export function generateMockSearchResponse(): SearchResponse {
  return {
    SurveyJobs: [generateMockSurveyJob()],
    Paging: {
      TotalRecordCount: 20,
      RecordsReturned: 10
    },
    SearchFilters: [generateMockSearchFilter()]
  };
}
