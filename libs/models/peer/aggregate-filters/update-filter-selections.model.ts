import { ExchangeMapFilter } from '../exchange-map-filter.model';

export interface UpdateFilterSelections {
  type: keyof ExchangeMapFilter;
  selections: any[];
}

export function generateMockUpdateFilterSelectionsModel(
  type: keyof ExchangeMapFilter = 'Exchanges', selections = ['MockItem']
): UpdateFilterSelections {
  return {
    type: type,
    selections: selections
  };
}
