import { Injectable } from '@angular/core';

import { Effect, Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import * as fromUserFilterActions from 'libs/features/user-filter/actions/user-filter.actions';
import * as fromSearchResultsActions from 'libs/features/search/actions/search-results.actions';
import * as fromSearchPageActions from 'libs/features/search/actions/search-page.actions';
import * as fromSaveFilterModalActions from 'libs/features/user-filter/actions/save-filter-modal.actions';
import * as fromSavedFiltersPopover from 'libs/features/user-filter/actions/saved-filters-popover.actions';
import * as fromUserFilterReducer from 'libs/features/user-filter/reducers';
import { PayfactorsSearchApiModelMapper } from 'libs/features/search/helpers';
import { UserFilterApiService } from 'libs/data/payfactors-api';
import { UserFilterTypeData } from 'libs/features/user-filter/models';

import { buildUpsertRequest, getDefaultFilter } from '../helpers';

@Injectable()
export class JobSearchUserFilterEffects {

  @Effect()
  initJobSearchUserFilter$ = this.actions$
  .ofType(fromUserFilterActions.INIT_USER_FILTER)
  .pipe(
    switchMap(() => {
      return this.userFilterApiService.getAll({ Type: this.userFilterTypeData.Type })
        .pipe(
          mergeMap(response => [
              new fromUserFilterActions.GetSavedFiltersSuccess(
                this.payfactorsSearchApiModelMapper.mapSearchSavedFilterResponseToSavedFilter(response)),
              new fromSearchPageActions.ShowPage(),
              new fromUserFilterActions.ApplyDefault()
          ]),
          catchError(response => [
            new fromUserFilterActions.GetSavedFiltersError(),
            new fromSearchResultsActions.GetResults({ keepFilteredOutOptions: false }),
            new fromSearchPageActions.ShowPage()
          ])
        );
    })
  );

  @Effect()
  getSavedFiltersSuccess$ = this.actions$
  .ofType(fromUserFilterActions.GET_SAVED_FILTERS_SUCCESS)
  .pipe(
    mergeMap((action: fromUserFilterActions.GetSavedFiltersSuccess) => {
      const defaultFilter = getDefaultFilter(action.payload);
      const defaultFilterId = defaultFilter ? defaultFilter.Id : '';
      return [ new fromUserFilterActions.SetDefaultFilter(defaultFilterId) ];
    })
  );

  @Effect()
  applyDefaultSavedFilter$ = this.actions$
  .ofType(fromUserFilterActions.APPLY_DEFAULT_SAVED_FILTER)
  .pipe(
    withLatestFrom(
      this.store.select(fromUserFilterReducer.getSavedFilters),
      (action: fromUserFilterActions.ApplyDefault, savedFilters) =>
        ({ action, savedFilters })),
    mergeMap(data => {
      const actions = [];
      const defaultFilter = getDefaultFilter(data.savedFilters);
      const defaultFilterId = defaultFilter ? defaultFilter.Id : '';
      actions.push(new fromUserFilterActions.SetDefaultFilter(defaultFilterId));

      if (defaultFilter) {
        actions.push(new fromUserFilterActions.SelectSavedFilter(defaultFilter));
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
      const savedFilterId = modalData.SavedFilter ? modalData.SavedFilter.Id : null;
      const isEditMode = !!savedFilterId;
      const searchFilters = isEditMode
        ? null
        : this.payfactorsSearchApiModelMapper.mapMultiSelectFiltersToSearchFilters(modalData.SearchFiltersToSave);
      const upsertRequest = buildUpsertRequest(savedFilterId, modalData, searchFilters);
      const isDefaultFilter = isEditMode
        ? modalData.SavedFilter.MetaInfo.Default
        : false;
      let currentDefault = null;
      if (modalData.SetAsDefault && !isDefaultFilter) {
        currentDefault = getDefaultFilter(data.savedFilters);
      }
      if (!!currentDefault) {
        const metaInfo = { Default: false };
        actions.push(new fromSaveFilterModalActions.UpdateMetaInfo(
          { savedFilter: currentDefault, metaInfo: metaInfo }));
      }
      actions.push(new fromUserFilterActions.Upsert(upsertRequest));
      return actions;
    })
  );

  @Effect()
  updateSavedFilterMetaInfo$ = this.actions$
  .ofType(fromSaveFilterModalActions.UPDATE_META_INFO)
  .pipe(
    switchMap((action: fromSaveFilterModalActions.UpdateMetaInfo) => {
      const savedFilter = action.payload.savedFilter;
      return this.userFilterApiService.upsert({
        SavedFilter: {
          Name: savedFilter.Name,
          Id: savedFilter.Id,
          MetaInfo: action.payload.metaInfo
        },
        Type: this.userFilterTypeData.Type
      })
      .pipe(
        map(() => {
          return new fromSaveFilterModalActions.UpdateMetaInfoSuccess();
        })
      );
    })
  );

  @Effect()
  editSavedFilter$ = this.actions$
  .ofType(fromSavedFiltersPopover.EDIT_SAVED_FILTER)
  .pipe(
    mergeMap((action: fromSavedFiltersPopover.Edit) => {
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
    private userFilterTypeData: UserFilterTypeData
  ) { }
}
