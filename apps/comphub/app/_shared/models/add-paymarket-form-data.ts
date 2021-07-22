export interface AddPayMarketFormData {
  Name: string;
  Country: string;
  Currency: string;
  Location: string;
  Industry: string;
  Size: string;
  GeoLabel: string;
  OrganizationTypeId: number;
  IsGovernmentContractor: boolean;
}

export function generateMockAddPayMarketFormData(): AddPayMarketFormData {
  return {
    Name: 'Pay Market Name',
    Country: 'USA',
    Currency: 'USD',
    Location: 'Burlington, MA',
    Industry: 'Software',
    Size: '100 - 500',
    GeoLabel: 'CityState',
    OrganizationTypeId: 1,
    IsGovernmentContractor: false
  };
}
