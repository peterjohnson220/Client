import { SearchFilter, SavedFilterType, UserFilterUpsertRequest } from 'libs/models/payfactors-api';
import { SaveFilterModalData } from 'libs/features/user-filter/models';
import { SavedFilter } from 'libs/features/search/models';

export function buildUpsertRequest(id: string, modalData: SaveFilterModalData, filters?: SearchFilter[])
  : UserFilterUpsertRequest {
  const request = {
    Type: SavedFilterType.JobSearch,
    SavedFilter: {
      Name: modalData.Name,
      MetaInfo: {
        Default: modalData.SetAsDefault
      }
    }
  };
  let savedFilter = request.SavedFilter;
  if (!!id) {
    savedFilter = Object.assign({ Id: id }, savedFilter);
  } else {
    savedFilter = Object.assign({ Filters: filters }, savedFilter);
  }
  request.SavedFilter = savedFilter;
  return request;
}

export function getDefaultFilter(savedFilters: SavedFilter[]): SavedFilter {
  return savedFilters.find(f => f.MetaInfo.Default === true);
}
