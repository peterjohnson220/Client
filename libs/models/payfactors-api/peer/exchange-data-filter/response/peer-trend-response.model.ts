import { ExchangeExplorerScopeResponseContext } from './exchange-explorer-scope-response-context.model';

import { SearchFilterMappingDataObj } from 'libs/features/search/search/models';
import { ExchangeJobSearchOption } from 'libs/models/peer/ExchangeJobSearchOption';

export interface PeerTrendResponse {
  ExchangeExplorerScopeContext: ExchangeExplorerScopeResponseContext;
  SearchFilterMappingData: SearchFilterMappingDataObj;
  MinDate: Date;
  MaxDate: Date;
  RollForward: boolean;
}
