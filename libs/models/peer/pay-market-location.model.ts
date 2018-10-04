export interface PayMarketLocationModel {
  CountryCode: string;
  Cities: string[];
  States: string[];
}

export function generateMockPayMarketLocation() {
  return {
    CountryCode: 'USA',
    Cities: ['Boston, Ma', 'Manchester, NH, San Diego, CA'],
    States: ['MA']
  };
}
