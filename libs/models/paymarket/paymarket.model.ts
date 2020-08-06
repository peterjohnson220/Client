export interface PayMarket {
 CompanyPayMarketId: number;
 CompanyId: number;
 PayMarket: string;
 IndustryLabel: string;
 IndustryValue: string;
 SizeLabel: string;
 SizeValue: string;
 GeoLabel: string;
 GeoValue: string;
 CreateDate?: Date;
 CreateUser?: number;
 DefaultScope?: boolean;
 CountryCode: string;
 CurrencyCode: string;
 LinkedPayMarket: string;
 LinkedPayMarketId?: number;
 LinkedPayMarketAdj?: number;
 ShowInLinkedStructure?: boolean;
}

export interface PayMarketWithMdScope extends PayMarket {
  IndustryGroup: string;
  Region: string;
  State: string;
  Metro: string;
  City: string;
}

export interface PayMarketAssociationsSummary {
  PaymarketName: string;
  LinkedPaymarketId?: number;
  LinkedPaymarketName?: string;
  PricingProjectsCount: number;
  PublishedPricingsCount: number;
  EmployeeCount: number;
  StructuresCount: number;
}

export function generateMockPayMarket(): PayMarket {
  return {
    CompanyPayMarketId: 23504,
    CompanyId: 512,
    PayMarket: 'Wisconsin',
    IndustryLabel: 'Industry',
    IndustryValue: 'All',
    SizeLabel: 'Employees',
    SizeValue: '500 - 1,000',
    GeoLabel: 'Metro',
    GeoValue: 'Appleton, WI',
    CreateDate: new Date(),
    CreateUser: 4824,
    DefaultScope: true,
    CountryCode: 'USA',
    CurrencyCode: 'USD',
    LinkedPayMarket: null,
    LinkedPayMarketId: null,
    LinkedPayMarketAdj: 60,
    ShowInLinkedStructure: true
  };
}
