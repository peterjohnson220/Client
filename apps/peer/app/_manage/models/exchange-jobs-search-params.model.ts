export interface ExchangeJobsSearchParams {
  exchangeId: number;
  titleSearchTerm: string;
  descriptionSearchTerm: string;
}

export function generateMockExchangeJobsSearchParams(): ExchangeJobsSearchParams {
  return {
    exchangeId: 123,
    titleSearchTerm: 'titleSearchTerm',
    descriptionSearchTerm: 'descriptionSearchTerm'
  };
}
