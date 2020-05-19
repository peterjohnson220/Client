import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import { EmployeeSearchApiService } from 'libs/data/payfactors-api/search/employees';
import * as fromSearchResultsActions from 'libs/features/search/actions/search-results.actions';
import { TotalRewardsEmployeeSearchResponse } from 'libs/models/payfactors-api/employee-search/response/employee-search-response.model';
import * as fromSearchReducer from 'libs/features/search/reducers';
import { PayfactorsSearchApiModelMapper } from 'libs/features/search/helpers';
import { TotalRewardsApiService } from 'libs/data/payfactors-api/total-rewards';

import * as fromEmployeeSearchResultsActions from '../actions/employee-search-results.actions';

@Injectable()
export class EmployeeSearchResultsEffects {

  @Effect()
  getResults$ = this.searchEmployees(this.actions$.pipe(ofType(fromSearchResultsActions.GET_RESULTS)));

  @Effect()
  getMoreResults$ = this.searchEmployees(this.actions$.pipe(ofType(fromSearchResultsActions.GET_MORE_RESULTS)));

  searchEmployees(action$: Actions<Action>): Observable<Action> {
    return action$
      .pipe(
        withLatestFrom(
          this.store.select(fromSearchReducer.getResultsPagingOptions),
          (action: fromSearchResultsActions.GetResults, pagingOptions) => ({action, pagingOptions})
        ),
        switchMap((data) => {
          const searchRequest = {
            FilterOptions: {
              ReturnFilters: false,
              AggregateCount: 0
            },
            Filters: [],
            PagingOptions: this.payfactorsSearchApiModelMapper.mapResultsPagingOptionsToPagingOptions(data.pagingOptions)
          };

          return this.totalRewardsApi.searchEmployees(searchRequest).pipe(
            mergeMap((response: TotalRewardsEmployeeSearchResponse) => {
              const actions = [];
              if (searchRequest.PagingOptions.From > 0) {
                actions.push(new fromSearchResultsActions.GetMoreResultsSuccess());
                actions.push(new fromEmployeeSearchResultsActions.AddEmployeeResults(response.EmployeeResults.$values));
              } else {
                actions.push(new fromSearchResultsActions.GetResultsSuccess({totalRecordCount: response.Paging.TotalRecordCount}));
                actions.push(new fromEmployeeSearchResultsActions.ReplaceEmployeeResults((response.EmployeeResults.$values)));
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
    private employeeSearchApi: EmployeeSearchApiService,
    private totalRewardsApi: TotalRewardsApiService,
    private payfactorsSearchApiModelMapper: PayfactorsSearchApiModelMapper,
    private actions$: Actions
  ) {}
}
