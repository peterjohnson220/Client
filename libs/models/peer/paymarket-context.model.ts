import { generateMockPayMarket, PayMarket } from '../paymarket';
import { generateMockMapGeoData, MapGeoData } from './exchange-map-response.model';

export interface PayMarketContext {
  PayMarket: PayMarket;
  PayMarketGeoData: MapGeoData;
}

export function generateMockPayMarketContext(): PayMarketContext {
  return {
    PayMarket: generateMockPayMarket(),
    PayMarketGeoData: generateMockMapGeoData()
  };
}
