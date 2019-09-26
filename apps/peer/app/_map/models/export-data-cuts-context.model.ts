import { ExchangeScopeItem } from 'libs/models/peer/exchange-scope';

export interface ExportDataCutsContext {
  dataIsFiltered: boolean;
  exchangeScopeItems: ExchangeScopeItem[];
  selectedExchangeScope: ExchangeScopeItem;
}

