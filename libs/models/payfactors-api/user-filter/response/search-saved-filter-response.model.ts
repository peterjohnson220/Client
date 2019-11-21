import { generateMockSearchFilter, SearchFilter } from '../../search';

export interface SearchSavedFilterResponse {
  Id: string;
  Name: string;
  MetaInfo: any;
  Filters: SearchFilter[];
}

export function generateMockSearchSavedFilterResponse(): SearchSavedFilterResponse {
  return {
    Id: 'MOCK_ID',
    Name: 'MOCK_SAVED_FILTER_RESPONSE',
    MetaInfo: {},
    Filters: [generateMockSearchFilter()]
  };
}
