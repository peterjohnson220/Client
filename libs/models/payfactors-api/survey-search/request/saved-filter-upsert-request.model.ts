import { SavedFilterType } from '../../user-filter';
import { SearchFilter } from '../../search';

export interface SavedFilterUpsertRequest {
  Type: SavedFilterType.SurveySearch;
  SavedFilter: {
    Id?: string,
    Name: string,
    Filters?: SearchFilter[],
    MetaInfo: {
      DefaultPayMarkets: number[]
    }
  };
}
