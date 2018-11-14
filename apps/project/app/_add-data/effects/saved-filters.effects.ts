import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import * as cloneDeep from 'lodash.clonedeep';

import { UserFilterApiService } from 'libs/data/payfactors-api/user';
import { SavedFilterType } from 'libs/models/payfactors-api/user-filter/saved-filter-type';

import * as fromSavedFiltersActions from '../actions/saved-filters.actions';
import * as fromSearchFiltersActions from '../actions/search-filters.actions';
import * as fromSearchResultsActions from '../actions/search-results.actions';
import * as fromSingledFilterActions from '../actions/singled-filter.actions';
import * as fromAddDataReducer from '../reducers';
import { PayfactorsApiHelper, PayfactorsApiModelMapper } from '../helpers';
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
      switchMap((action: fromSavedFiltersActions.GetSavedFilters) => {
          return this.userFilterApiService.getAll({ Type: SavedFilterType.SurveySearch })
            .pipe(
              map(response => {
                const savedFilters = PayfactorsApiModelMapper.mapSurveySavedFilterResponseToSavedFilter(response);

                if (action.payload && action.payload.savedFilterIdToSelect) {
                  savedFilters.find(sf => sf.Id === action.payload.savedFilterIdToSelect).Selected = true;
                }

                return new fromSavedFiltersActions.GetSavedFiltersSuccess(savedFilters);
              })
            );
      })
    );

  @Effect()
  saveFilter$ = this.actions$
    .ofType(fromSavedFiltersActions.SAVE_FILTER)
    .pipe(
      withLatestFrom(
        this.store.select(fromAddDataReducer.getFilters),
        this.store.select(fromAddDataReducer.getJobContext),
        this.store.select(fromAddDataReducer.getProjectSearchContext),
        this.store.select(fromAddDataReducer.getSavedFilters),
        (action: fromSavedFiltersActions.SaveFilter, filters, jobContext, projectSearchContext, savedFilters) =>
          ({action, filters, jobContext, projectSearchContext, savedFilters})),
      switchMap((data) => {
        const actions = [];

        const upsertRequest = {
          Type: SavedFilterType.SurveySearch,
          SavedFilter: {
            Name: data.action.payload.Name,
            Filters: PayfactorsApiHelper.getSelectedFiltersAsSearchFilters(data.filters.filter(f => !f.Locked)),
            MetaInfo: {
              DefaultPayMarkets: []
            }
          }
        };

        if (data.action.payload.SetAsPayMarketDefault) {
          const payMarketId =
            (!!data.jobContext && data.jobContext.JobPayMarketId) ||
            (!!data.projectSearchContext && data.projectSearchContext.PayMarketId);
          upsertRequest.SavedFilter.MetaInfo.DefaultPayMarkets = [payMarketId];

          const currentDefault = data.savedFilters
            .find(sf => sf.MetaInfo.DefaultPayMarkets.some(dpmid => dpmid.toString() === payMarketId.toString()));
          if (!!currentDefault) {
            actions.push(new fromSavedFiltersActions.RemoveSavedFilterAsDefault({ savedFilter: currentDefault, payMarketId }));
          }
        }

        return this.userFilterApiService.upsert(upsertRequest)
          .pipe(
            mergeMap((response) => {
              actions.push(new fromSavedFiltersActions.SaveFilterSuccess());
              actions.push(new fromSavedFiltersActions.GetSavedFilters({ savedFilterIdToSelect: response}));

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
        this.store.select(fromAddDataReducer.getFilterIdToDelete),
        (action: fromSavedFiltersActions.DeleteSavedFilter, filterIdToDelete) => ({action, filterIdToDelete})),
      switchMap((data) => {
        return this.userFilterApiService.remove({
          SavedFilter: {
            Id: data.filterIdToDelete,
          },
          Type: SavedFilterType.SurveySearch
        })
        .pipe(
          mergeMap(() => [
              new fromSavedFiltersActions.DeleteSavedFilterSuccess(),
              new fromSavedFiltersActions.GetSavedFilters()
          ])
        );
      })
    );

  @Effect()
  selectSavedFilter$ = this.actions$
    .ofType(fromSavedFiltersActions.SELECT_SAVED_FILTER)
    .pipe(
      withLatestFrom(
        this.store.select(fromAddDataReducer.getSearchingFilter),
        this.store.select(fromAddDataReducer.getSingledFilter),
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

  @Effect({dispatch: false})
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
        });
      })
    );

  @Effect()
  applyDefaultSavedFilter$ = this.actions$
    .ofType(fromSavedFiltersActions.APPLY_DEFAULT_SAVED_FILTER)
    .pipe(
      withLatestFrom(
        this.store.select(fromAddDataReducer.getJobContext),
        this.store.select(fromAddDataReducer.getProjectSearchContext),
        this.store.select(fromAddDataReducer.getSavedFilters),
        (action: fromSavedFiltersActions.ApplyDefaultSavedFilter, jobContext, projectSearchContext, savedFilters) =>
          ({ action, jobContext, projectSearchContext, savedFilters })),
      map(data => {
        const payMarketId =
          (!!data.jobContext && data.jobContext.JobPayMarketId) ||
          (!!data.projectSearchContext && data.projectSearchContext.PayMarketId);

        const defaultFilterForThisPayMarket = data.savedFilters
          .find(sf => sf.MetaInfo.DefaultPayMarkets
            .some(dpmid => dpmid.toString() === payMarketId.toString()));

        if (defaultFilterForThisPayMarket) {
          return new fromSavedFiltersActions.SelectSavedFilter(defaultFilterForThisPayMarket);
        } else {
          return new fromSearchResultsActions.GetResults({ keepFilteredOutOptions: false });
        }
      })
    );


  constructor(
    private actions$: Actions,
    private userFilterApiService: UserFilterApiService,
    private store: Store<fromAddDataReducer.State>
  ) { }
}
