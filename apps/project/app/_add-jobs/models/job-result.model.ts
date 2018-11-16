export interface JobResult {
  Id: number;
  Title: string;
  Code: string;
  Source: string;
  BaseMRP: number;
  TCCMRP: number;
  IsMappedToPeerExchange: boolean;
  IsSelected: boolean;
}

export function generateMockPayFactorsJobResult(): JobResult {
  return {
    Id: 100,
    Title: 'Accountant',
    Code: '2345',
    Source: 'PayFactors',
    BaseMRP: 56.3,
    TCCMRP: 58.1,
    IsMappedToPeerExchange: false,
    IsSelected: false
  };
}

export function generateMockCompanyJobResultWithPeerExchange(): JobResult {
  return {
    Id: 101,
    Title: 'Accountant I',
    Code: '123456',
    Source: 'Company 13',
    BaseMRP: 56.3,
    TCCMRP: 58.1,
    IsMappedToPeerExchange: true,
    IsSelected: false
  };
}
