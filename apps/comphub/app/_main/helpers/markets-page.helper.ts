import { AddPayMarketRequest } from 'libs/models/payfactors-api';

import { MarketDataScope, AddPayMarketFormData } from '../models';

export class MarketsPageHelper {
  static buildAddPayMarketRequest(companyId: number, data: AddPayMarketFormData): AddPayMarketRequest {
    return {
      DefaultExchangeScopes: [],
      DefaultScopes: [],
      PayMarket: {
        CompanyPayMarketId: 0,
        CompanyId: companyId,
        CountryCode: data.Country,
        CurrencyCode: data.Currency,
        GeoLabel: 'CityState',
        GeoValue: data.Location,
        IndustryLabel: 'Industry',
        IndustryValue: data.Industry,
        PayMarket: data.Name,
        SizeLabel: 'Employees',
        SizeValue: data.Size,
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
