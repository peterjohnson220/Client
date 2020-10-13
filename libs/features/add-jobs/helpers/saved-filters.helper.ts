import { Injectable } from '@angular/core';

import { UserFilterUpsertRequest } from 'libs/models/payfactors-api';
import { SaveFilterModalData, UserFilterTypeData } from 'libs/features/user-filter/models';
import { SavedFilter } from 'libs/features/user-filter/models';
import { PayfactorsSearchApiModelMapper } from 'libs/features/search/helpers';

@Injectable()
export class SavedFiltersHelper {

  constructor(
    private payfactorsSearchApiModelMapper: PayfactorsSearchApiModelMapper) { }

  buildUpsertRequest(modalData: SaveFilterModalData, userFilterTypeData: UserFilterTypeData): UserFilterUpsertRequest {
    const id = modalData.SavedFilter ? modalData.SavedFilter.Id : null;
    const isEditMode = !!id;
    const searchFilters = isEditMode
      ? null
      : this.payfactorsSearchApiModelMapper.mapMultiSelectFiltersToSearchFilters(modalData.SearchFiltersToSave);
    const request = {
      Type: userFilterTypeData.Type,
      SavedFilter: {
        Name: modalData.Name,
        MetaInfo: {
          Default: modalData.SetAsDefault
        }
      }
    };
    let savedFilter = request.SavedFilter;
    if (isEditMode) {
      savedFilter = Object.assign({ Id: id }, savedFilter);
    } else {
      savedFilter = Object.assign({ Filters: searchFilters }, savedFilter);
    }
    request.SavedFilter = savedFilter;
    return request;
  }

  getDefaultFilter(savedFilters: SavedFilter[]): SavedFilter {
    return savedFilters.find(f => f.MetaInfo.Default === true);
  }

  isDefaultFilter(savedFilter: SavedFilter): boolean {
    return !!savedFilter && savedFilter.Id ? savedFilter.MetaInfo.Default : false;
  }
}
