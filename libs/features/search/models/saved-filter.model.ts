import { MultiSelectFilter, generateMockMultiSelectFilter } from './filter.model';

export interface SavedFilter {
  Id: string;
  Name: string;
  MetaInfo: any;
  Filters: MultiSelectFilter[];
  Selected: boolean;
}

export function generateMockSavedFilter(): SavedFilter {
    return {
      Id: 'IamafilterId',
      Name: 'Mercer 2018 Surveys',
      MetaInfo: {
        DefaultPayMarkets: [ 1234 ]
      },
      Filters: [generateMockMultiSelectFilter()],
      Selected: true
    };
}
