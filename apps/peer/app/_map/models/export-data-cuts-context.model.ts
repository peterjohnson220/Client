import { ExchangeScopeItem } from 'libs/models/peer/exchange-scope';

export interface ExportDataCutsContext {
  exchangeScopeItems: ExchangeScopeItem[];
  selectedExchangeScope: ExchangeScopeItem;
}

