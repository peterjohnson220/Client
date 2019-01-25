import { AddPayMarketRequest } from 'libs/models/payfactors-api';

import { AddPayMarketModalData } from '../models/add-paymarket-modal-data';
import { MarketDataScope } from '../models';

export class MarketsPageHelper {
  static buildAddPayMarketRequest(companyId: number, modalData: AddPayMarketModalData): AddPayMarketRequest {
    return {
      DefaultExchangeScopes: [],
      DefaultScopes: [],
      PayMarket: {
        CompanyPayMarketId: 0,
        CompanyId: companyId,
        CountryCode: modalData.Country,
        CurrencyCode: modalData.Currency,
        GeoLabel: 'CityState',
        GeoValue: modalData.Location,
        IndustryLabel: 'Industry',
        IndustryValue: modalData.Industry,
        PayMarket: modalData.Name,
        SizeLabel: 'Employees',
        SizeValue: modalData.Size,
        LinkedPayMarket: ''
      }
    };
  }

  static buildDefaultMarketDataScope(): MarketDataScope {
    return {
      Locations: [{ Name: 'National', Value: 'National'}],
      Sizes: [{ Name: 'All', Value: 'All' }],
      Industries: [{ Name: 'All', Value: 'All'}]
    };
  }
}
