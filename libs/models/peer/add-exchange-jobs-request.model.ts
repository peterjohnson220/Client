export interface AddExchangeJobsRequest {
  ExchangeId: number;
  MDJobsBaseIds: number[];
}

export function generateMockAddExchangeJobsRequest(): AddExchangeJobsRequest {
  return {
    ExchangeId: 1,
    MDJobsBaseIds: [1, 2]
  };
}
