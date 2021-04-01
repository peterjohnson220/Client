import { PayMarketWithMdScope } from 'libs/models/paymarket';

export class PayMarketModalHelper {

  static buildDefaultPayMarket(): PayMarketWithMdScope {
    return {
      CompanyId: 0,
      LinkedPayMarket: null,
      CompanyPayMarketId: 0,
      PayMarket: null,
      LinkedPayMarketId: null,
      LinkedPayMarketAdj: null,
      ShowInLinkedStructure: null,
      IndustryLabel: 'Industry',
      IndustryValue: 'All',
      IndustryGroup: null,
      SizeLabel: 'Employees',
      SizeValue: 'All',
      GeoLabel: 'Region',
      GeoValue: 'All',
      Region: null,
      State: null,
      Metro: null,
      City: null,
      CountryCode: 'USA',
      CurrencyCode: 'USD'
    };
  }
}
