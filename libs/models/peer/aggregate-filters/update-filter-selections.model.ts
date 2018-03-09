import { ExchangeDataCutFilter } from '../exchange-data-cut-filter.model';

export interface UpdateFilterSelections {
  type: keyof ExchangeDataCutFilter;
  selections: any[];
}

export function generateMockUpdateFilterSelectionsModel(
  type: keyof ExchangeDataCutFilter = 'Exchanges', selections = ['MockSelection']
): UpdateFilterSelections {
  return {
    type: type,
    selections: selections
  };
}
