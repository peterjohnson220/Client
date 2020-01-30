import { GenericKeyValue } from 'libs/models/common';

export interface JobResult {
  Id: string;
  Title: string;
  Code: string;
  Source: string;
  BaseMRP: string;
  TCCMRP: string;
  IsMappedToPeerExchange: boolean;
  Family: string;
  Description: string;
  FLSAStatus: string;
  Category: string;
  Level: string;
  EEO: string;
  UdfFields: GenericKeyValue<string, string>[];
  IsSelected: boolean;
  IsPayfactorsJob: boolean;
  PricingDataLoading: boolean;
  PricingDataLoaded: boolean;
  ShowJobDetail: boolean;
}

export function generateMockPayFactorsJobResult(): JobResult {
  return {
    Id: '100',
    Title: 'Accountant',
    Code: '2345',
    Source: 'PayFactors',
    BaseMRP: '56.3',
    TCCMRP: '58.1',
    IsMappedToPeerExchange: false,
    Family: 'Finance',
    Description: 'I am a description',
    FLSAStatus: 'Exempt',
    Category: 'Finance',
    Level: 'II',
    EEO: 'Typically Professionals',
    UdfFields: [{
      Key: 'UdfField1',
      Value: 'UdfValue'
    }],
    IsSelected: false,
    IsPayfactorsJob: true,
    PricingDataLoaded: false,
    PricingDataLoading: false,
    ShowJobDetail: false
  };
}

export function generateMockCompanyJobResultWithPeerExchange(): JobResult {
  return {
    ...generateMockPayFactorsJobResult(),
    IsPayfactorsJob: false,
    IsMappedToPeerExchange: true
  };
}
