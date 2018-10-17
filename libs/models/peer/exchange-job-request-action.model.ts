import { ExchangeJobRequest, generateMockExchangeJobRequest } from './exchange-job-request.model';

export interface ExchangeJobRequestAction {
  JobRequest: ExchangeJobRequest;
  Reason: string;
  Action: string;
}

export function generateMockExchangeJobRequestAction(): ExchangeJobRequestAction {
  return {
    JobRequest: generateMockExchangeJobRequest(),
    Reason: 'Because',
    Action: 'Deny'
  };
}
