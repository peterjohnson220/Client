import { ExchangeExplorerContextInfo, generateMockExchangeExplorerContextInfo } from 'libs/models/peer';

import { ExchangeExplorerScopeResponse, generateMockExchangeExplorerScopeResponse } from './exchange-explorer-scope-response.model';

export interface ExchangeExplorerDataCutResponse {
  ExchangeExplorerContextInfo: ExchangeExplorerContextInfo;
  DataCutScope: ExchangeExplorerScopeResponse;
}

export function generateMockExchangeExplorerDataCutResponse(): ExchangeExplorerDataCutResponse {
  return {
    ExchangeExplorerContextInfo: generateMockExchangeExplorerContextInfo(),
    DataCutScope: generateMockExchangeExplorerScopeResponse()
  };
}
