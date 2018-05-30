import { ExchangeListItem, generateMockExchangeListItem } from 'libs/models/peer';

export interface ExchangesAndLastVisted {
  Exchanges: ExchangeListItem[];
  LastVisitedExchangeId: number;
}

export function generateMockExchangesAndLastVisted(): ExchangesAndLastVisted {
  return {
    Exchanges: [generateMockExchangeListItem()],
    LastVisitedExchangeId: 10
  };
}
