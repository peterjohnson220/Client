import { ExchangeExplorerContextInfo, generateMockExchangeExplorerContextInfo } from 'libs/models/peer';
import { ExchangeExplorerScopeResponseContext,
         generateMockExchangeExplorerScopeResponseContext
} from 'libs/models/payfactors-api/peer/exchange-data-filter/response';

export interface ExchangeExplorerDataCutResponse {
  ExchangeExplorerContextInfo: ExchangeExplorerContextInfo;
  ScopeContext: ExchangeExplorerScopeResponseContext;
}

export function generateMockExchangeExplorerDataCutResponse(): ExchangeExplorerDataCutResponse {
  return {
    ExchangeExplorerContextInfo: generateMockExchangeExplorerContextInfo(),
    ScopeContext: generateMockExchangeExplorerScopeResponseContext()
  };
}
