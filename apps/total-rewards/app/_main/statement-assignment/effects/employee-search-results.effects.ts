import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import * as fromInfiniteScrollActions from 'libs/features/infinite-scroll/actions/infinite-scroll.actions';
import * as fromSearchResultsActions from 'libs/features/search/actions/search-results.actions';
import * as fromSearchFiltersActions from 'libs/features/search/actions/search-filters.actions';
import * as fromSearchReducer from 'libs/features/search/reducers';

import { TotalRewardsEmployeeSearchResponse } from 'libs/models/payfactors-api/total-rewards/response/employee-search-response.model';
import { PayfactorsSearchApiHelper, PayfactorsSearchApiModelMapper } from 'libs/features/search/helpers';
import {
  TotalRewardsAssignmentApiService,
  TotalRewardsSearchApiService
} from 'libs/data/payfactors-api/total-rewards';
import { ScrollIdConstants } from 'libs/features/infinite-scroll/models';

import * as fromEmployeeSearchResultsActions from '../actions/employee-search-results.actions';

@Injectable()
export class EmployeeSearchResultsEffects {

  @Effect()
  getResults$ = this.searchEmployees(this.actions$.pipe(ofType(fromSearchResultsActions.GET_RESULTS)));

  @Effect()
  getMoreResults$ = this.searchEmployees(this.actions$.pipe(ofType(fromSearchResultsActions.GET_MORE_RESULTS)));

  searchEmployees(action$: Actions): Observable<Action> {
    return action$
      .pipe(
        withLatestFrom(
          this.store.select(fromSearchReducer.getResultsPagingOptions),
          this.store.select(fromSearchReducer.getParentFilters),
          (action: fromSearchResultsActions.GetResults, pagingOptions, filters) => ({action, pagingOptions, filters})
        ),
        switchMap((data) => {
          const searchRequest = {
            FilterOptions: {
              ReturnFilters: true,
              AggregateCount: 5
            },
            Filters: this.payfactorsSearchApiHelper.getSelectedFiltersAsSearchFilters(data.filters),
            SearchFields: this.payfactorsSearchApiHelper.getTextFiltersWithValuesAsSearchFields(data.filters),
            PagingOptions: this.payfactorsSearchApiModelMapper.mapResultsPagingOptionsToPagingOptions(data.pagingOptions)
          };

          return this.totalRewardsSearchApiService.searchEmployees(searchRequest).pipe(
            mergeMap((response: TotalRewardsEmployeeSearchResponse) => {
              const actions = [];
              const filters = this.payfactorsSearchApiModelMapper.mapSearchFiltersToFilters(response.SearchFilters);
              if (searchRequest.PagingOptions.From > 0) {
                actions.push(new fromSearchResultsActions.GetMoreResultsSuccess());
                actions.push(new fromEmployeeSearchResultsActions.AddEmployeeResults(response.EmployeeResults));
              } else {
                actions.push(new fromSearchResultsActions.GetResultsSuccess({totalRecordCount: response.Paging.TotalRecordCount}));

                actions.push(new fromEmployeeSearchResultsActions.ReplaceEmployeeResults((response.EmployeeResults)));
                actions.push(new fromSearchFiltersActions.RefreshFilters({
                  filters: filters,
                  keepFilteredOutOptions: data.action.payload.keepFilteredOutOptions
                }));
                if (data.action.payload && data.action.payload.searchAggregation) {
                  actions.push(new fromInfiniteScrollActions.Load({scrollId: ScrollIdConstants.SEARCH_SINGLED_FILTER}));
                }
              }
              return actions;
            }),
            catchError(() => of(new fromSearchResultsActions.GetResultsError()))
          );
        })
      );
  }

  constructor(
    private store: Store<fromSearchReducer.State>,
    private totalRewardsAssignmentApiService: TotalRewardsAssignmentApiService,
    private totalRewardsSearchApiService: TotalRewardsSearchApiService,
    private payfactorsSearchApiModelMapper: PayfactorsSearchApiModelMapper,
    private payfactorsSearchApiHelper: PayfactorsSearchApiHelper,
    private actions$: Actions
  ) {}
}
