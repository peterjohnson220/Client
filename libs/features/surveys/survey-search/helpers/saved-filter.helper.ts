import { Injectable } from '@angular/core';

import cloneDeep from 'lodash/cloneDeep';

import { SavedFilterType, UserFilterUpsertRequest } from 'libs/models/payfactors-api';
import { SavedFilter, SaveFilterModalData } from 'libs/features/users/user-filter/models';
import { PayfactorsSearchApiModelMapper } from 'libs/features/search/search/helpers';

import { JobContext, PricingMatchDataSearchContext } from '../models';

@Injectable()
export class SavedFilterHelper {

  constructor(private payfactorsSearchApiModelMapper: PayfactorsSearchApiModelMapper) { }

  isPayMarketDefaultFilter(savedFilter: SavedFilter, payMarketId: number): boolean {
    return (!!savedFilter && !!savedFilter.Id)
      ? savedFilter.MetaInfo.DefaultPayMarkets.some(dpmid => dpmid.toString() === payMarketId.toString())
      : false;
  }

  buildUpsertRequest(payMarketId: number, modalData: SaveFilterModalData)
    : UserFilterUpsertRequest {
    const id = modalData.SavedFilter ? modalData.SavedFilter.Id : null;
    const isEditMode = !!id;
    const searchFilters = isEditMode
      ? null
      : this.payfactorsSearchApiModelMapper.mapMultiSelectFiltersToSearchFilters(modalData.SearchFiltersToSave);
    const isPayMarketDefault = this.isPayMarketDefaultFilter(modalData.SavedFilter, payMarketId);
    let defaultPayMarkets = isEditMode
      ? cloneDeep(modalData.SavedFilter.MetaInfo.DefaultPayMarkets)
      : [];
    if (modalData.SetAsDefault && !isPayMarketDefault) {
      defaultPayMarkets = defaultPayMarkets.concat(payMarketId.toString());
    } else if (!modalData.SetAsDefault) {
      defaultPayMarkets = defaultPayMarkets.filter(pid => pid.toString() !== payMarketId.toString());
    }
    const request = {
      Type: SavedFilterType.SurveySearch,
      SavedFilter: {
        Name: modalData.Name,
        MetaInfo: {
          DefaultPayMarkets: defaultPayMarkets
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

  removePaymarketFromDefaultPayMarkets(payMarketId: number, savedFilter: SavedFilter): any {
    return {
      DefaultPayMarkets: savedFilter.MetaInfo.DefaultPayMarkets
        .filter(dpmid => dpmid.toString() !== payMarketId.toString())
    };
  }

  getPayMarketId(jobContext: JobContext, pricingMatchDataSearchContext: PricingMatchDataSearchContext): number {
    return (!!jobContext && jobContext.JobPayMarketId) ||
      (!!pricingMatchDataSearchContext && pricingMatchDataSearchContext.PaymarketId);
  }

  getDefaultFilter(payMarketId: number, savedFilters: SavedFilter[]): SavedFilter {
    return savedFilters.find(sf => sf.MetaInfo.DefaultPayMarkets != null
      && sf.MetaInfo.DefaultPayMarkets.some(dpmid => dpmid.toString() === payMarketId.toString()));
  }
}
