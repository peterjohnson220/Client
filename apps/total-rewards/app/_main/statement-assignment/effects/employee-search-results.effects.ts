import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, filter, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import * as fromInfiniteScrollActions from 'libs/features/search/infinite-scroll/actions/infinite-scroll.actions';
import * as fromSearchResultsActions from 'libs/features/search/search/actions/search-results.actions';
import * as fromSearchFiltersActions from 'libs/features/search/search/actions/search-filters.actions';
import * as fromSearchReducer from 'libs/features/search/search/reducers';
import * as fromStatementAssignmentPageReducer from 'apps/total-rewards/app/_main/statement-assignment/reducers';

import { TotalRewardsEmployeeSearchResponse } from 'libs/models/payfactors-api/total-rewards/response/employee-search-response.model';
import { PayfactorsSearchApiHelper, PayfactorsSearchApiModelMapper } from 'libs/features/search/search/helpers';
import { TotalRewardsAssignmentApiService, TotalRewardsSearchApiService } from 'libs/data/payfactors-api/total-rewards';
import { ScrollIdConstants } from 'libs/features/search/infinite-scroll/models';
import { SearchFeatureIds } from 'libs/features/search/search/enums/search-feature-ids';

import * as fromEmployeeSearchResultsActions from '../actions/employee-search-results.actions';

@Injectable()
export class EmployeeSearchResultsEffects {

  @Effect()
  getResults$ = this.searchUnassignedEmployees(this.actions$.pipe(ofType(fromSearchResultsActions.GET_RESULTS)));

  @Effect()
  getMoreResults$ = this.searchUnassignedEmployees(this.actions$.pipe(ofType(fromSearchResultsActions.GET_MORE_RESULTS)));

  searchUnassignedEmployees(action$: Actions): Observable<Action> {
    return action$
      .pipe(
        withLatestFrom(
          this.store.select(fromSearchReducer.getResultsPagingOptions),
          this.store.select(fromSearchReducer.getParentFilters),
          this.store.select(fromSearchReducer.getSearchFilterMappingData),
          this.store.select(fromSearchReducer.getSearchFeatureId),
          this.store.select(fromStatementAssignmentPageReducer.getStatement),
          (action: fromSearchResultsActions.GetResults, pagingOptions, filters, searchFilterMappingDataObj, searchFeatureId, statement) =>
            ({action, pagingOptions, filters, searchFilterMappingDataObj, searchFeatureId, statement})
        ),
        filter((data) => data.searchFeatureId === SearchFeatureIds.StatementAssignment),
        switchMap((data) => {
          const searchRequest = {
            StatementId: data.statement.StatementId,
            FilterOptions: {
              ReturnFilters: true,
              AggregateCount: 10
            },
            Filters: this.payfactorsSearchApiHelper.getSelectedFiltersAsSearchFilters(data.filters),
            SearchFields: this.payfactorsSearchApiHelper.getTextFiltersWithValuesAsSearchFields(data.filters),
            PagingOptions: this.payfactorsSearchApiModelMapper.mapResultsPagingOptionsToPagingOptions(data.pagingOptions)
          };

          return this.totalRewardsSearchApiService.searchUnassignedEmployees(searchRequest).pipe(
            mergeMap((response: TotalRewardsEmployeeSearchResponse) => {
              const actions = [];
              const searchFilters = this.payfactorsSearchApiHelper.sliceSearchFiltersOptions(response.SearchFilters, searchRequest.Filters, 5);
              const filters = this.payfactorsSearchApiModelMapper.mapSearchFiltersToFilters(searchFilters, data.searchFilterMappingDataObj);
              if (searchRequest.PagingOptions.From > 0) {
                actions.push(new fromSearchResultsActions.GetMoreResultsSuccess());
                actions.push(new fromEmployeeSearchResultsActions.AddEmployeeResults({
                  employeeResults: response.EmployeeResults,
                  noResultsMessage: response.NoResultsMessage
                }));
              } else {
                actions.push(new fromSearchResultsActions.GetResultsSuccess({totalRecordCount: response.Paging.TotalRecordCount}));

                actions.push(new fromEmployeeSearchResultsActions.ReplaceEmployeeResults({
                  employeeResults: response.EmployeeResults,
                  noResultsMessage: response.NoResultsMessage
                }));
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
    private totalRewardsSearchApiService: TotalRewardsSearchApiService,
    private payfactorsSearchApiModelMapper: PayfactorsSearchApiModelMapper,
    private payfactorsSearchApiHelper: PayfactorsSearchApiHelper,
    private actions$: Actions
  ) {}
}
