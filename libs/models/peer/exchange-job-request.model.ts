export interface ExchangeJobRequest {
  ExchangeId: number;
  JobTitle: string;
  JobFamily: string;
  JobLevel: string;
  RequestUser: string;
  RequestCompany: string;
  RequestDate: any;
  IsPayfactorsJob: boolean;
}

export function generateMockExchangeJobRequest(): ExchangeJobRequest {
  return {
    ExchangeId: 1,
    JobTitle: 'Mock Job',
    JobFamily: 'Mock Job Family',
    JobLevel: 'III',
    RequestUser: 'Mock Mobson',
    RequestCompany: 'Mock Company',
    RequestDate: '01-01-2018',
    IsPayfactorsJob: true
  };
}
