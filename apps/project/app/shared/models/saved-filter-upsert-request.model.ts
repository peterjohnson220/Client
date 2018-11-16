import { SavedFilterType } from 'libs/models/payfactors-api/user-filter/saved-filter-type';
import { SearchFilter } from 'libs/models';

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
