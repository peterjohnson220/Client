import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, concatMap, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

import * as fromUserFilterActions from 'libs/features/user-filter/actions/user-filter.actions';
import { TotalRewardsAssignmentApiService } from 'libs/data/payfactors-api/total-rewards';
import * as fromSearchResultsActions from 'libs/features/search/actions/search-results.actions';
import * as fromSearchReducer from 'libs/features/search/reducers';

import * as fromTotalRewardsReducer from '../reducers';
import * as fromEmployeeSearchResultsActions from '../actions/employee-search-results.actions';
import * as fromStatementAssignmentModalActions from '../actions/statement-assignment-modal.actions';
import { PayfactorsSearchApiHelper } from '../../../../../../libs/features/search/helpers';

@Injectable()
export class StatementAssignmentModalEffects {

  @Effect()
  setContext$ = this.actions$
    .pipe(
      ofType(fromStatementAssignmentModalActions.SET_CONTEXT),
      mergeMap(() =>
        [ new fromUserFilterActions.Init() ]
      )
    );

  @Effect()
  closeModal$ = this.actions$.pipe(
    ofType(fromStatementAssignmentModalActions.CLOSE_MODAL),
    mergeMap(() =>
      [
        new fromSearchResultsActions.ClearResults(),
        new fromEmployeeSearchResultsActions.ClearSelectedEmployees(),
        new fromEmployeeSearchResultsActions.ClearEmployeeResults()
      ]
    )
  );

  @Effect()
  assignEmployees$ = this.actions$
    .pipe(
      ofType(fromStatementAssignmentModalActions.ASSIGN_EMPLOYEES),
      withLatestFrom(
        this.store.select(fromTotalRewardsReducer.getSelectedCompanyEmployeeIds),
        this.store.select(fromTotalRewardsReducer.getStatementId),
        (action, employees, statementId) => ({action, employees, statementId})
      ),
      concatMap((data) => {
        const request = {
          CompanyEmployeeIds: data.employees,
          StatementId: data.statementId
        };
        return this.totalRewardsAssignmentApi.assignEmployees(request).pipe(
          mergeMap(() => {
            const actions = [];
            actions.push(new fromStatementAssignmentModalActions.AssignEmployeesSuccess());
            actions.push(new fromStatementAssignmentModalActions.CloseModal());

            return actions;
          }),
          catchError(() => of(new fromStatementAssignmentModalActions.AssignEmployeesError()))
        );
        }
      )
    );

  @Effect()
  assignAllEmployees$ = this.actions$.pipe(
    ofType(fromStatementAssignmentModalActions.ASSIGN_ALL_EMPLOYEES),
    withLatestFrom(
      this.store.select(fromSearchReducer.getParentFilters),
      this.store.select(fromTotalRewardsReducer.getStatementId),
      this.store.select(fromSearchReducer.getNumberOfResultsOnServer),
      (action: fromStatementAssignmentModalActions.AssignAllEmployees, filters, statementId, resultsCount) =>
        ({action, filters, statementId, resultsCount})
    ),
    switchMap((data) => {
      const searchRequest = {
        StatementId: data.statementId,
        FilterOptions: {
          ReturnFilters: false,
          AggregateCount: 0
        },
        Filters: this.payfactorsSearchApiHelper.getSelectedFiltersAsSearchFilters(data.filters),
        SearchFields: this.payfactorsSearchApiHelper.getTextFiltersWithValuesAsSearchFields(data.filters),
        PagingOptions: { From: 0, Count: data.resultsCount }
      };

      return this.totalRewardsAssignmentApi.assignAllEmployees(searchRequest).pipe(
        mergeMap(() => {
          const actions = [];
          actions.push(new fromStatementAssignmentModalActions.AssignAllEmployeesSuccess());
          actions.push(new fromStatementAssignmentModalActions.CloseModal());
          return actions;
        }),
        catchError(() => of(new fromStatementAssignmentModalActions.AssignAllEmployeesError()))
      );
    })
  );

  constructor(
    private store: Store<fromTotalRewardsReducer.State>,
    private totalRewardsAssignmentApi: TotalRewardsAssignmentApiService,
    private payfactorsSearchApiHelper: PayfactorsSearchApiHelper,
    private actions$: Actions
  ) {}
}
