import { generateMockMultiSelectFilter } from '../../search/models';

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
