import { Injectable } from '@angular/core';

import { Effect, Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import * as fromUserFilterActions from 'libs/features/user-filter/actions/user-filter.actions';
import * as fromSearchResultsActions from 'libs/features/search/actions/search-results.actions';
import * as fromSearchPageActions from 'libs/features/search/actions/search-page.actions';
import * as fromSaveFilterModalActions from 'libs/features/user-filter/actions/save-filter-modal.actions';
import * as fromUserFilterPopoverActions from 'libs/features/user-filter/actions/user-filter-popover.actions';
import * as fromUserFilterReducer from 'libs/features/user-filter/reducers';
import { PayfactorsSearchApiModelMapper } from 'libs/features/search/helpers';
import { UserFilterApiService } from 'libs/data/payfactors-api';
import { UserFilterTypeData } from 'libs/features/user-filter/models';

import { SavedFiltersHelper } from '../helpers';

@Injectable()
export class JobSearchUserFilterEffects {

  @Effect()
  initJobSearchUserFilter$ = this.actions$
  .ofType(fromUserFilterActions.INIT)
  .pipe(
    switchMap(() => {
      return this.userFilterApiService.getAll({ Type: this.userFilterTypeData.Type })
        .pipe(
          mergeMap(response => [
              new fromUserFilterActions.GetSuccess(
                this.payfactorsSearchApiModelMapper.mapSearchSavedFilterResponseToSavedFilter(response)),
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
  .ofType(fromUserFilterActions.GET_SUCCESS)
  .pipe(
    mergeMap((action: fromUserFilterActions.GetSuccess) => {
      const defaultFilter = this.savedFiltersHelper.getDefaultFilter(action.payload);
      const defaultFilterId = defaultFilter ? defaultFilter.Id : '';
      return [ new fromUserFilterActions.SetDefault(defaultFilterId) ];
    })
  );

  @Effect()
  applyDefaultSavedFilter$ = this.actions$
  .ofType(fromUserFilterActions.APPLY_DEFAULT)
  .pipe(
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
  .ofType(fromSaveFilterModalActions.SAVE)
  .pipe(
    withLatestFrom(
      this.store.select(fromUserFilterReducer.getSavedFilters),
      (action: fromSaveFilterModalActions.Save, savedFilters) => ({ action, savedFilters})
    ),
    mergeMap((data) => {
      const actions = [];
      const modalData = data.action.payload;
      const upsertRequest = this.savedFiltersHelper.buildUpsertRequest(modalData);
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
  .ofType(fromSaveFilterModalActions.UPDATE_META_INFO_SUCCESS)
  .pipe(
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
  .ofType(fromUserFilterPopoverActions.EDIT)
  .pipe(
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
    private userFilterTypeData: UserFilterTypeData,
    private savedFiltersHelper: SavedFiltersHelper
  ) { }
}
