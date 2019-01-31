import { ExchangeRequestAction, generateMockExchangeRequestAction } from './exchange-request-action.model';
import { ExchangeJobRequest, generateMockExchangeJobRequest } from './exchange-job-request.model';

export interface ExchangeJobRequestAction extends ExchangeRequestAction {
  JobRequest: ExchangeJobRequest;
}

export function generateMockExchangeJobRequestAction(): ExchangeJobRequestAction {
  return {
    ...generateMockExchangeRequestAction(),
    JobRequest: generateMockExchangeJobRequest()
  };
}
