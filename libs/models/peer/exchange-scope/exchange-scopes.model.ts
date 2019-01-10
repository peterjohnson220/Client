import { ExchangeScopeItem } from './exchange-scope-item.model';

export interface ExchangeScopes {
  ExchangeId: number;
  ExchangeName: string;
  ExchangeScopeItems: ExchangeScopeItem[];
}
