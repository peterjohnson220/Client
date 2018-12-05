import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import * as cloneDeep from 'lodash.clonedeep';

import { UserFilterApiService } from 'libs/data/payfactors-api/user';
import { SavedFilterType } from 'libs/models/payfactors-api/user-filter/saved-filter-type';
import * as fromSearchFiltersActions from 'libs/features/search/actions/search-filters.actions';
import * as fromSavedFilterActions from 'libs/features/search/actions/saved-filters.actions';
import * as fromSingledFilterActions from 'libs/features/search/actions/singled-filter.actions';
import * as fromSearchResultsActions from 'libs/features/search/actions/search-results.actions';
import { PayfactorsSearchApiModelMapper, FiltersHelper } from 'libs/features/search/helpers';
import { MultiSelectFilter } from 'libs/features/search/models';
import * as fromSearchReducer from 'libs/features/search/reducers';

import * as fromSurveySearchReducer from '../reducers';
import { SavedFilterHelper } from '../helpers';

@Injectable()
export class SavedFiltersEffects {

  @Effect()
  initSavedFilters = this.actions$
    .ofType(fromSavedFilterActions.INIT_SAVED_FILTERS)
    .pipe(
      switchMap(() => {
        return this.userFilterApiService.getAll({ Type: SavedFilterType.SurveySearch })
          .pipe(
            mergeMap(response => [
               new fromSavedFilterActions.GetSavedFiltersSuccess(
                 this.payfactorsSearchApiModelMapper.mapSurveySavedFilterResponseToSavedFilter(response)),
               new fromSavedFilterActions.ApplyDefaultSavedFilter()
            ])
          );
      })
    );

  @Effect()
  getSavedFilters$ = this.actions$
    .ofType(fromSavedFilterActions.GET_SAVED_FILTERS)
    .pipe(
      withLatestFrom(
        this.store.select(fromSurveySearchReducer.getJobContext),
        this.store.select(fromSurveySearchReducer.getProjectSearchContext),
        (action: fromSavedFilterActions.GetSavedFilters, jobContext, projectSearchContext) =>
          ({action, jobContext, projectSearchContext})),
      switchMap((data) => {
          return this.userFilterApiService.getAll({ Type: SavedFilterType.SurveySearch })
            .pipe(
              mergeMap(response => {
                const actions = [];
                const savedFilters = this.payfactorsSearchApiModelMapper.mapSurveySavedFilterResponseToSavedFilter(response);
                const payMarketId = SavedFilterHelper.getPayMarketId(data.jobContext, data.projectSearchContext);
                const defaultFilterForThisPayMarket = SavedFilterHelper.getDefaultFilter(payMarketId, savedFilters);
                const defaultFilterId = defaultFilterForThisPayMarket ? defaultFilterForThisPayMarket.Id : '';
                actions.push(new fromSavedFilterActions.SetDefaultFilter(defaultFilterId));
                actions.push(new fromSavedFilterActions.GetSavedFiltersSuccess(savedFilters));
                return actions;
              })
            );
      })
    );

  @Effect()
  saveFilter$ = this.actions$
    .ofType(fromSavedFilterActions.SAVE_FILTER)
    .pipe(
      withLatestFrom(
        this.store.select(fromSurveySearchReducer.getJobContext),
        this.store.select(fromSurveySearchReducer.getProjectSearchContext),
        this.store.select(fromSearchReducer.getSavedFilters),
        (action: fromSavedFilterActions.SaveFilter, jobContext, projectSearchContext, savedFilters) =>
          ({action, jobContext, projectSearchContext, savedFilters})),
      switchMap((data) => {
        const actions = [];
        const modalData = data.action.payload;
        const savedFilterId = modalData.SavedFilter ? modalData.SavedFilter.Id : null;
        const isEditMode = !!savedFilterId;
        const searchFilters = isEditMode
          ? null
          : this.payfactorsSearchApiModelMapper.mapMultiSelectFiltersToSearchFilters(modalData.SearchFiltersToSave);
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
              actions.push(new fromSavedFilterActions.SaveFilterSuccess({isNew: !isEditMode, savedFilterId: response}));
              if (!!currentDefault) {
                actions.push(new fromSavedFilterActions.RemoveSavedFilterAsDefault(
                  { savedFilter: currentDefault, payMarketId }));
              } else {
                actions.push(new fromSavedFilterActions.GetSavedFilters());
              }
              return actions;
            }),
            catchError(response => {
                return of(response.status === 409
                  ? new fromSavedFilterActions.SavedFilterSaveConflict()
                  : new fromSavedFilterActions.SavedFilterSaveError());
            })
          );
      })
    );

  @Effect()
  deleteSavedFilter$ = this.actions$
    .ofType(fromSavedFilterActions.DELETE_SAVED_FILTER)
    .pipe(
      withLatestFrom(
        this.store.select(fromSearchReducer.getFilterIdToDelete),
        this.store.select(fromSearchReducer.getSelectedSavedFilter),
        (action: fromSavedFilterActions.DeleteSavedFilter, filterIdToDelete, currentSelectedSavedFilter) =>
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
              actions.push(new fromSavedFilterActions.ToggleSavedFilterSelection(data.currentSelectedSavedFilter));
            }
            actions.push(new fromSavedFilterActions.DeleteSavedFilterSuccess());
            actions.push(new fromSavedFilterActions.GetSavedFilters());
            return actions;
          })
        );
      })
    );

  @Effect()
  selectSavedFilter$ = this.actions$
    .ofType(fromSavedFilterActions.SELECT_SAVED_FILTER)
    .pipe(
      withLatestFrom(
        this.store.select(fromSearchReducer.getSearchingFilter),
        this.store.select(fromSearchReducer.getSingledFilter),
        (action: fromSavedFilterActions.SelectSavedFilter, searchingFilter, singledFilter) =>
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
        actions.push(new fromSearchResultsActions.GetResults({ keepFilteredOutOptions: false, searchAggregation: data.searchingFilter }));

        return actions;
      })
    );

  @Effect()
  toggleSavedFilterSelection$ = this.actions$
    .ofType(fromSavedFilterActions.TOGGLE_SAVED_FILTER_SELECTION)
    .pipe(
      withLatestFrom(
        this.store.select(fromSearchReducer.getSelectedSavedFilter),
        this.store.select(fromSearchReducer.getSearchingFilter),
        (action: fromSavedFilterActions.ToggleSavedFilterSelection, selectedSavedFilter, searchingFilter) =>
          ({ action, selectedSavedFilter, searchingFilter })
      ),
      mergeMap(data => {
        const actions = [];
        const currentSavedFilter = data.action.payload;
        if (!!data.selectedSavedFilter && data.selectedSavedFilter.Id === currentSavedFilter.Id) {
          actions.push(new fromSavedFilterActions.UnselectSavedFilter());
          actions.push(new fromSearchFiltersActions.ClearSavedFilters(data.selectedSavedFilter.Filters));
          actions.push(new fromSearchResultsActions.GetResults({ keepFilteredOutOptions: false, searchAggregation: data.searchingFilter }));
        } else {
          actions.push(new fromSavedFilterActions.SelectSavedFilter(currentSavedFilter));
        }

        return actions;
      })
    );

  @Effect()
  removeSavedFilterAsDefault = this.actions$
    .ofType(fromSavedFilterActions.REMOVE_SAVED_FILTER_AS_DEFAULT)
    .pipe(
      switchMap((action: fromSavedFilterActions.RemoveSavedFilterAsDefault) => {
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
          map(() => new fromSavedFilterActions.GetSavedFilters())
        );
      })
    );

  @Effect()
  applyDefaultSavedFilter$ = this.actions$
    .ofType(fromSavedFilterActions.APPLY_DEFAULT_SAVED_FILTER)
    .pipe(
      withLatestFrom(
        this.store.select(fromSurveySearchReducer.getJobContext),
        this.store.select(fromSurveySearchReducer.getProjectSearchContext),
        this.store.select(fromSearchReducer.getSavedFilters),
        (action: fromSavedFilterActions.ApplyDefaultSavedFilter, jobContext, projectSearchContext, savedFilters) =>
          ({ action, jobContext, projectSearchContext, savedFilters })),
      mergeMap(data => {
        const actions = [];
        const payMarketId = SavedFilterHelper.getPayMarketId(data.jobContext, data.projectSearchContext);
        const defaultFilterForThisPayMarket = SavedFilterHelper.getDefaultFilter(payMarketId, data.savedFilters);
        const defaultFilterId = defaultFilterForThisPayMarket ? defaultFilterForThisPayMarket.Id : '';
        actions.push(new fromSavedFilterActions.SetDefaultFilter(defaultFilterId));

        if (defaultFilterForThisPayMarket) {
          actions.push(new fromSavedFilterActions.SelectSavedFilter(defaultFilterForThisPayMarket));
        } else {
          actions.push(new fromSearchResultsActions.GetResults({ keepFilteredOutOptions: false }));
        }
        return actions;
      })
    );

  @Effect()
  editSavedFilter$ = this.actions$
    .ofType(fromSavedFilterActions.EDIT_SAVED_FILTER)
    .pipe(
      withLatestFrom(
        this.store.select(fromSurveySearchReducer.getJobContext),
        this.store.select(fromSurveySearchReducer.getProjectSearchContext),
        (action: fromSavedFilterActions.EditSavedFilter, jobContext, projectSearchContext) =>
          ({ action, jobContext, projectSearchContext })),
      mergeMap(data => {
        const actions = [];
        const payMarketId = SavedFilterHelper.getPayMarketId(data.jobContext, data.projectSearchContext);
        const isPayMarketDefault = SavedFilterHelper.isPayMarketDefaultFilter(data.action.payload, payMarketId);

        actions.push(new fromSavedFilterActions.SetFilterDataToEdit({
          Name: data.action.payload.Name,
          SetAsPayMarketDefault: isPayMarketDefault,
          SearchFiltersToSave: data.action.payload.Filters,
          SavedFilter: data.action.payload
        }));
        actions.push(new fromSavedFilterActions.OpenSaveFilterModal());

        return actions;
      })
    );

  @Effect()
  createSavedFilter$ = this.actions$
    .ofType(fromSavedFilterActions.CREATE_SAVED_FILTER)
    .pipe(
      withLatestFrom(
        this.store.select(fromSearchReducer.getFilters),
        (action: fromSavedFilterActions.CreateSavedFilter, filters) => ({ action, filters })),
      mergeMap(data => {
        const actions = [];
        const selectedFilters = FiltersHelper.getMultiSelectFiltersWithSelections(data.filters);
        actions.push(new fromSavedFilterActions.SetFilterDataToEdit({
          Name: '',
          SetAsPayMarketDefault: false,
          SearchFiltersToSave: selectedFilters.filter(f => !f.Locked && !f.SaveDisabled)
        }));
        actions.push(new fromSavedFilterActions.OpenSaveFilterModal());

        return actions;
      })
    );

  constructor(
    private actions$: Actions,
    private userFilterApiService: UserFilterApiService,
    private payfactorsSearchApiModelMapper: PayfactorsSearchApiModelMapper,
    private store: Store<fromSurveySearchReducer.State>
  ) { }
}
