import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import * as fromUserFilterActions from 'libs/features/users/user-filter/actions/user-filter.actions';
import * as fromSearchResultsActions from 'libs/features/search/search/actions/search-results.actions';
import * as fromSearchPageActions from 'libs/features/search/search/actions/search-page.actions';
import * as fromSaveFilterModalActions from 'libs/features/users/user-filter/actions/save-filter-modal.actions';
import * as fromUserFilterPopoverActions from 'libs/features/users/user-filter/actions/user-filter-popover.actions';
import * as fromUserFilterReducer from 'libs/features/users/user-filter/reducers';
import { PayfactorsSearchApiModelMapper } from 'libs/features/search/search/helpers';
import { UserFilterApiService } from 'libs/data/payfactors-api';
import { SavedFiltersHelper } from 'libs/features/jobs/add-jobs/helpers';
import * as fromSearchReducer from 'libs/features/search/search/reducers';

@Injectable()
export class JobSearchUserFilterEffects {

  @Effect()
  initJobSearchUserFilter$ = this.actions$
  .pipe(
    ofType(fromUserFilterActions.INIT),
    withLatestFrom(
      this.store.select(fromSearchReducer.getSearchFilterMappingData),
      this.store.select(fromSearchReducer.getUserFilterTypeData),
      (action, searchFilterMappingDataObj, userFilterTypeData) => ({ action, searchFilterMappingDataObj, userFilterTypeData })),
    switchMap((data) => {
      return this.userFilterApiService.getAll({ Type: data.userFilterTypeData.Type })
        .pipe(
          mergeMap(response => [
              new fromUserFilterActions.GetSuccess(
                this.payfactorsSearchApiModelMapper.mapSearchSavedFilterResponseToSavedFilter(response, data.searchFilterMappingDataObj)),
              new fromSearchPageActions.ShowPage(),
              new fromUserFilterActions.ApplyDefault()
          ]),
          catchError(response => [
            new fromUserFilterActions.GetError(),
            new fromSearchResultsActions.GetResults({ keepFilteredOutOptions: false }),
            new fromSearchPageActions.ShowPage()
          ])
        );
    })
  );

  @Effect()
  getSavedFiltersSuccess$ = this.actions$
  .pipe(
    ofType(fromUserFilterActions.GET_SUCCESS),
    mergeMap((action: fromUserFilterActions.GetSuccess) => {
      const defaultFilter = this.savedFiltersHelper.getDefaultFilter(action.payload);
      const defaultFilterId = defaultFilter ? defaultFilter.Id : '';
      return [ new fromUserFilterActions.SetDefault(defaultFilterId) ];
    })
  );

  @Effect()
  applyDefaultSavedFilter$ = this.actions$
  .pipe(
    ofType(fromUserFilterActions.APPLY_DEFAULT),
    withLatestFrom(
      this.store.select(fromUserFilterReducer.getSavedFilters),
      (action: fromUserFilterActions.ApplyDefault, savedFilters) =>
        ({ action, savedFilters })),
    mergeMap(data => {
      const actions = [];
      const defaultFilter = this.savedFiltersHelper.getDefaultFilter(data.savedFilters);
      const defaultFilterId = defaultFilter ? defaultFilter.Id : '';
      actions.push(new fromUserFilterActions.SetDefault(defaultFilterId));

      if (defaultFilter) {
        actions.push(new fromUserFilterPopoverActions.Select(defaultFilter));
      } else {
        actions.push(new fromSearchResultsActions.GetResults({ keepFilteredOutOptions: false }));
      }
      return actions;
    })
  );

  @Effect()
  saveFilter$ = this.actions$
  .pipe(
    ofType(fromSaveFilterModalActions.SAVE),
    withLatestFrom(
      this.store.select(fromUserFilterReducer.getSavedFilters),
      this.store.select(fromSearchReducer.getUserFilterTypeData),
      (action: fromSaveFilterModalActions.Save, savedFilters, userFilterTypeData) => ({ action, savedFilters, userFilterTypeData})
    ),
    mergeMap((data) => {
      const actions = [];
      const modalData = data.action.payload;
      const upsertRequest = this.savedFiltersHelper.buildUpsertRequest(modalData, data.userFilterTypeData);
      const isDefaultFilter = this.savedFiltersHelper.isDefaultFilter(modalData.SavedFilter);
      let currentDefault = null;
      if (modalData.SetAsDefault && !isDefaultFilter) {
        currentDefault = this.savedFiltersHelper.getDefaultFilter(data.savedFilters);
      }
      if (!!currentDefault) {
        const metaInfo = { Default: false };
        actions.push(new fromSaveFilterModalActions.SetUpsertRequest(upsertRequest));
        actions.push(new fromSaveFilterModalActions.UpdateMetaInfo(
          { savedFilter: currentDefault, metaInfo: metaInfo }));
      } else {
        actions.push(new fromUserFilterActions.Upsert(upsertRequest));
      }
      return actions;
    })
  );

  @Effect()
  updateMetaInfoSuccess$ = this.actions$
  .pipe(
    ofType(fromSaveFilterModalActions.UPDATE_META_INFO_SUCCESS),
    withLatestFrom(
      this.store.select(fromUserFilterReducer.getUpsertRequest),
      (action: fromSaveFilterModalActions.UpdateMetaInfoSuccess, upsertRequest) =>
        ({ action, upsertRequest })),
    mergeMap(data => {
      return [ new fromUserFilterActions.Upsert(data.upsertRequest) ];
    })
  );

  @Effect()
  editSavedFilter$ = this.actions$
  .pipe(
    ofType(fromUserFilterPopoverActions.EDIT),
    mergeMap((action: fromUserFilterPopoverActions.Edit) => {
      const actions = [];
      actions.push(new fromSaveFilterModalActions.SetModalData({
        Name: action.payload.Name,
        SetAsDefault: action.payload.MetaInfo.Default,
        SearchFiltersToSave: action.payload.Filters,
        SavedFilter: action.payload
      }));
      actions.push(new fromSaveFilterModalActions.OpenSaveModal());

      return actions;
    })
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromUserFilterReducer.State>,
    private userFilterApiService: UserFilterApiService,
    private payfactorsSearchApiModelMapper: PayfactorsSearchApiModelMapper,
    private savedFiltersHelper: SavedFiltersHelper
  ) { }
}
