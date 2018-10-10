export interface ExchangeJobRequest {
  DocumentId: string;
  ExchangeId: number;
  JobTitle: string;
  JobFamily: string;
  JobLevel: string;
  JobDescription: string;
  Reason: string;
  RequestUser: string;
  RequestCompany: string;
  RequestDate: any;
  IsPayfactorsJob: boolean;
}

export function generateMockExchangeJobRequest(): ExchangeJobRequest {
  return {
    DocumentId: '1234',
    ExchangeId: 1,
    JobTitle: 'Mock Job',
    JobFamily: 'Mock Job Family',
    JobLevel: 'III',
    JobDescription: 'Mock Job Description',
    Reason: 'Because',
    RequestUser: 'Mock Mobson',
    RequestCompany: 'Mock Company',
    RequestDate: '01-01-2018',
    IsPayfactorsJob: true
  };
}
