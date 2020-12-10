import { PayMarketMDCutModel } from 'libs/models/paymarket';

export interface SavePayMarketsCutsRequest {
  PayMarketCuts: PayMarketMDCutModel[];
  PayMarketIds: number[];
}
