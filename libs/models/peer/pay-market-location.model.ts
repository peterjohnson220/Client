export interface PayMarketLocationModel{
  Cities: string[];
  States: string[];
}

export function generateMockPayMarketLocation(){
  return {
    Cities: ['Boston, Ma', 'Manchester, NH, San Diego, CA'],
    States: ['MA']
  };
}
