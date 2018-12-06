import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import * as cloneDeep from 'lodash.clonedeep';

import { UserFilterApiService } from 'libs/data/payfactors-api/user/index';
import { SavedFilterType } from 'libs/models/payfactors-api/user-filter/saved-filter-type';

import * as fromSavedFiltersActions from '../actions/saved-filters.actions';
import * as fromSearchFiltersActions from '../actions/search-filters.actions';
import * as fromSearchResultsActions from '../actions/search-results.actions';
import * as fromSingledFilterActions from '../actions/singled-filter.actions';
import * as fromSharedSearchReducer from '../../shared/reducers';
import { PayfactorsApiHelper, PayfactorsApiModelMapper, SavedFilterHelper } from '../helpers';
import { MultiSelectFilter } from '../models';

@Injectable()
export class SavedFiltersEffects {

  @Effect()
  initSavedFilters = this.actions$
    .ofType(fromSavedFiltersActions.INIT_SAVED_FILTERS)
    .pipe(
      switchMap(() => {
        return this.userFilterApiService.getAll({ Type: SavedFilterType.SurveySearch })
          .pipe(
            mergeMap(response => [
               new fromSavedFiltersActions.GetSavedFiltersSuccess(
                 PayfactorsApiModelMapper.mapSurveySavedFilterResponseToSavedFilter(response)),
               new fromSavedFiltersActions.ApplyDefaultSavedFilter()
            ])
          );
      })
    );

  @Effect()
  getSavedFilters$ = this.actions$
    .ofType(fromSavedFiltersActions.GET_SAVED_FILTERS)
    .pipe(
      withLatestFrom(
        this.store.select(fromSharedSearchReducer.getJobContext),
        this.store.select(fromSharedSearchReducer.getProjectSearchContext),
        (action: fromSavedFiltersActions.GetSavedFilters, jobContext, projectSearchContext) =>
          ({action, jobContext, projectSearchContext})),
      switchMap((data) => {
          return this.userFilterApiService.getAll({ Type: SavedFilterType.SurveySearch })
            .pipe(
              mergeMap(response => {
                const actions = [];
                const savedFilters = PayfactorsApiModelMapper.mapSurveySavedFilterResponseToSavedFilter(response);
                const payMarketId = SavedFilterHelper.getPayMarketId(data.jobContext, data.projectSearchContext);
                const defaultFilterForThisPayMarket = SavedFilterHelper.getDefaultFilter(payMarketId, savedFilters);
                const defaultFilterId = defaultFilterForThisPayMarket ? defaultFilterForThisPayMarket.Id : '';
                actions.push(new fromSavedFiltersActions.SetDefaultFilter(defaultFilterId));
                actions.push(new fromSavedFiltersActions.GetSavedFiltersSuccess(savedFilters));
                return actions;
              })
            );
      })
    );

  @Effect()
  saveFilter$ = this.actions$
    .ofType(fromSavedFiltersActions.SAVE_FILTER)
    .pipe(
      withLatestFrom(
        this.store.select(fromSharedSearchReducer.getFilters),
        this.store.select(fromSharedSearchReducer.getJobContext),
        this.store.select(fromSharedSearchReducer.getProjectSearchContext),
        this.store.select(fromSharedSearchReducer.getSavedFilters),
        (action: fromSavedFiltersActions.SaveFilter, filters, jobContext, projectSearchContext, savedFilters) =>
          ({action, filters, jobContext, projectSearchContext, savedFilters})),
      switchMap((data) => {
        const actions = [];
        const modalData = data.action.payload;
        const savedFilterId = modalData.SavedFilter ? modalData.SavedFilter.Id : null;
        const isEditMode = !!savedFilterId;
        const searchFilters = isEditMode
          ? null
          : PayfactorsApiHelper.getSelectedFiltersAsSearchFilters(data.filters.filter(f => !f.Locked && f.SaveDisabled !== true));
        const upsertRequest = SavedFilterHelper.getUpsertRequest(savedFilterId, modalData.Name, searchFilters);
        const payMarketId = SavedFilterHelper.getPayMarketId(data.jobContext, data.projectSearchContext);
        const isPayMarketDefault = isEditMode
          ? SavedFilterHelper.isPayMarketDefaultFilter(modalData.SavedFilter, payMarketId)
          : false;
        let defaultPayMarkets = isEditMode
          ? cloneDeep(modalData.SavedFilter.MetaInfo.DefaultPayMarkets)
          : [];
        let currentDefault = null;

        if (modalData.SetAsPayMarketDefault && !isPayMarketDefault) {
          currentDefault = SavedFilterHelper.getDefaultFilter(payMarketId, data.savedFilters);
          defaultPayMarkets = defaultPayMarkets.concat(payMarketId.toString());
        } else if (!modalData.SetAsPayMarketDefault) {
          defaultPayMarkets = defaultPayMarkets.filter(id => id.toString() !== payMarketId.toString());
        }

        upsertRequest.SavedFilter.MetaInfo.DefaultPayMarkets = defaultPayMarkets;

        return this.userFilterApiService.upsert(upsertRequest)
          .pipe(
            mergeMap((response) => {
              actions.push(new fromSavedFiltersActions.SaveFilterSuccess({isNew: !isEditMode, savedFilterId: response}));
              if (!!currentDefault) {
                actions.push(new fromSavedFiltersActions.RemoveSavedFilterAsDefault({ savedFilter: currentDefault, payMarketId }));
              } else {
                actions.push(new fromSavedFiltersActions.GetSavedFilters());
              }
              return actions;
            }),
            catchError(response => {
                return of(response.status === 409
                  ? new fromSavedFiltersActions.SavedFilterSaveConflict()
                  : new fromSavedFiltersActions.SavedFilterSaveError());
            })
          );
      })
    );

  @Effect()
  deleteSavedFilter$ = this.actions$
    .ofType(fromSavedFiltersActions.DELETE_SAVED_FILTER)
    .pipe(
      withLatestFrom(
        this.store.select(fromSharedSearchReducer.getFilterIdToDelete),
        this.store.select(fromSharedSearchReducer.getSelectedSavedFilter),
        (action: fromSavedFiltersActions.DeleteSavedFilter, filterIdToDelete, currentSelectedSavedFilter) =>
          ({action, filterIdToDelete, currentSelectedSavedFilter})),
      switchMap((data) => {
        return this.userFilterApiService.remove({
          SavedFilter: {
            Id: data.filterIdToDelete,
          },
          Type: SavedFilterType.SurveySearch
        })
        .pipe(
          mergeMap(() => {
            const actions = [];
            if (!!data.currentSelectedSavedFilter && data.filterIdToDelete === data.currentSelectedSavedFilter.Id) {
              actions.push(new fromSavedFiltersActions.ToggleSavedFilterSelection(data.currentSelectedSavedFilter));
            }
            actions.push(new fromSavedFiltersActions.DeleteSavedFilterSuccess());
            actions.push(new fromSavedFiltersActions.GetSavedFilters());
            return actions;
          })
        );
      })
    );

  @Effect()
  selectSavedFilter$ = this.actions$
    .ofType(fromSavedFiltersActions.SELECT_SAVED_FILTER)
    .pipe(
      withLatestFrom(
        this.store.select(fromSharedSearchReducer.getSearchingFilter),
        this.store.select(fromSharedSearchReducer.getSingledFilter),
        (action: fromSavedFiltersActions.SelectSavedFilter, searchingFilter, singledFilter) =>
          ({ action, searchingFilter, singledFilter })),
      mergeMap(data => {
        const actions = [];
        const savedFilters = data.action.payload.Filters;

        if (data.searchingFilter) {
          const savedFiltersSearchingFilter = <MultiSelectFilter>savedFilters.find(sf => sf.Id === data.singledFilter.Id);
          const selections = !!savedFiltersSearchingFilter ? savedFiltersSearchingFilter.Options : [];

          actions.push(new fromSingledFilterActions.ApplySelections(selections));
        }

        actions.push(new fromSearchFiltersActions.ApplySavedFilters(savedFilters));
        actions.push(new fromSearchResultsActions.GetResults({ keepFilteredOutOptions: false }));

        return actions;
      })
    );

  @Effect()
  toggleSavedFilterSelection$ = this.actions$
    .ofType(fromSavedFiltersActions.TOGGLE_SAVED_FILTER_SELECTION)
    .pipe(
      withLatestFrom(
        this.store.select(fromSharedSearchReducer.getSelectedSavedFilter),
        (action: fromSavedFiltersActions.ToggleSavedFilterSelection, selectedSavedFilter) =>
          ({ action, selectedSavedFilter })
      ),
      mergeMap(data => {
        const actions = [];
        const currentSavedFilter = data.action.payload;
        if (!!data.selectedSavedFilter && data.selectedSavedFilter.Id === currentSavedFilter.Id) {
          actions.push(new fromSavedFiltersActions.UnselectSavedFilter());
          actions.push(new fromSearchFiltersActions.ClearSavedFilters(data.selectedSavedFilter.Filters));
          actions.push(new fromSearchResultsActions.GetResults({ keepFilteredOutOptions: false }));
        } else {
          actions.push(new fromSavedFiltersActions.SelectSavedFilter(currentSavedFilter));
        }

        return actions;
      })
    );

  @Effect()
  removeSavedFilterAsDefault = this.actions$
    .ofType(fromSavedFiltersActions.REMOVE_SAVED_FILTER_AS_DEFAULT)
    .pipe(
      switchMap((action: fromSavedFiltersActions.RemoveSavedFilterAsDefault) => {
        const savedFilter = cloneDeep(action.payload.savedFilter);

        savedFilter.MetaInfo.DefaultPayMarkets = savedFilter.MetaInfo.DefaultPayMarkets
          .filter(dpmid => dpmid.toString() !== action.payload.payMarketId.toString());

        return this.userFilterApiService.upsert({
          SavedFilter: {
            Name: savedFilter.Name,
            Id: savedFilter.Id,
            MetaInfo: savedFilter.MetaInfo
          },
          Type: SavedFilterType.SurveySearch
        })
        .pipe(
          map(() => new fromSavedFiltersActions.GetSavedFilters())
        );
      })
    );

  @Effect()
  applyDefaultSavedFilter$ = this.actions$
    .ofType(fromSavedFiltersActions.APPLY_DEFAULT_SAVED_FILTER)
    .pipe(
      withLatestFrom(
        this.store.select(fromSharedSearchReducer.getJobContext),
        this.store.select(fromSharedSearchReducer.getProjectSearchContext),
        this.store.select(fromSharedSearchReducer.getSavedFilters),
        (action: fromSavedFiltersActions.ApplyDefaultSavedFilter, jobContext, projectSearchContext, savedFilters) =>
          ({ action, jobContext, projectSearchContext, savedFilters })),
      mergeMap(data => {
        const actions = [];
        const payMarketId = SavedFilterHelper.getPayMarketId(data.jobContext, data.projectSearchContext);
        const defaultFilterForThisPayMarket = SavedFilterHelper.getDefaultFilter(payMarketId, data.savedFilters);
        const defaultFilterId = defaultFilterForThisPayMarket ? defaultFilterForThisPayMarket.Id : '';
        actions.push(new fromSavedFiltersActions.SetDefaultFilter(defaultFilterId));

        if (defaultFilterForThisPayMarket) {
          actions.push(new fromSavedFiltersActions.SelectSavedFilter(defaultFilterForThisPayMarket));
        } else {
          actions.push(new fromSearchResultsActions.GetResults({ keepFilteredOutOptions: false }));
        }
        return actions;
      })
    );

  @Effect()
  editSavedFilter$ = this.actions$
    .ofType(fromSavedFiltersActions.EDIT_SAVED_FILTER)
    .pipe(
      withLatestFrom(
        this.store.select(fromSharedSearchReducer.getJobContext),
        this.store.select(fromSharedSearchReducer.getProjectSearchContext),
        (action: fromSavedFiltersActions.EditSavedFilter, jobContext, projectSearchContext) =>
          ({ action, jobContext, projectSearchContext })),
      mergeMap(data => {
        const actions = [];
        const payMarketId = SavedFilterHelper.getPayMarketId(data.jobContext, data.projectSearchContext);
        const isPayMarketDefault = SavedFilterHelper.isPayMarketDefaultFilter(data.action.payload, payMarketId);

        actions.push(new fromSavedFiltersActions.SetFilterDataToEdit({
          Name: data.action.payload.Name,
          SetAsPayMarketDefault: isPayMarketDefault,
          SavedFilter: data.action.payload
        }));
        actions.push(new fromSavedFiltersActions.OpenSaveFilterModal());

        return actions;
      })
    );

  constructor(
    private actions$: Actions,
    private userFilterApiService: UserFilterApiService,
    private store: Store<fromSharedSearchReducer.State>
  ) { }
}
