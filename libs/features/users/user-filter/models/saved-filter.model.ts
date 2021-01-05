import { generateMockMultiSelectFilter } from '../../../search/search/models';

export interface SavedFilter {
  Id: string;
  Name: string;
  MetaInfo: any;
  Filters: any[];
  Selected: boolean;
}

export function generateMockJobSearchSavedFilter(): SavedFilter {
    return {
      Id: 'IamafilterId',
      Name: 'Mercer 2018 Surveys',
      MetaInfo: {
        Default: false
      },
      Filters: [generateMockMultiSelectFilter()],
      Selected: true
    };
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
