export interface SurveyJob {
  Id: string;
  IsPayfactorsJob: boolean;
  Survey: Survey;
  Job: Job;
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
  Description: string;
  FLSAStatus?: string;
  Category?: string;
  Base50th: number;
  TCC50th: number;
  CountryCode?: string;
}

interface PagingResponse {
  TotalRecordCount: number;
  RecordsReturned: number;
}

export interface SearchResponse {
  SurveyJobs: SurveyJob[];
  Paging: PagingResponse;
  // SearchFilter<string>> SearchFilters
}



export function generateMockSurveyJob(): SurveyJob {
  return {
    Id: '12345',
    IsPayfactorsJob: false,
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
      Description: 'Lorem Ipsum',
      FLSAStatus: 'Typically Exempt',
      Category: 'Professional',
      Base50th: 1,
      TCC50th: 1,
      CountryCode: 'USA'
    }
  };
}

export function generateMockSearchResponse(): SearchResponse {
  return {
    SurveyJobs: [generateMockSurveyJob()],
    Paging: {
      TotalRecordCount: 20,
      RecordsReturned: 10
    }
  };
}
