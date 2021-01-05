import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, concatMap, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

import * as fromUserFilterActions from 'libs/features/users/user-filter/actions/user-filter.actions';
import { TotalRewardsAssignmentApiService } from 'libs/data/payfactors-api/total-rewards';
import * as fromSearchResultsActions from 'libs/features/search/search/actions/search-results.actions';
import * as fromSearchReducer from 'libs/features/search/search/reducers';
import { PayfactorsSearchApiHelper } from 'libs/features/search/search/helpers';

import * as fromTotalRewardsReducer from '../reducers';
import * as fromEmployeeSearchResultsActions from '../actions/employee-search-results.actions';
import * as fromStatementAssignmentModalActions from '../actions/statement-assignment-modal.actions';
import * as fromAssignedEmployeeGridActions from '../actions/assigned-employees-grid.actions';
import * as fromStatementAssignmentPageActions from '../actions/statement-assignment.page.actions';

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
        this.store.select(fromTotalRewardsReducer.getStatement),
        (action, employees, statement) => ({action, employees, statementId: statement.StatementId})
      ),
      concatMap((data) => {
        const request = {
          CompanyEmployeeIds: data.employees,
          StatementId: data.statementId
        };
        return this.totalRewardsAssignmentApi.assignEmployees(request).pipe(
          mergeMap((response) => {
            const actions = [];
            actions.push(new fromStatementAssignmentModalActions.AssignEmployeesSuccess(response));
            actions.push(new fromStatementAssignmentModalActions.CloseModal());
            actions.push(new fromAssignedEmployeeGridActions.LoadAssignedEmployees());
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
      this.store.select(fromTotalRewardsReducer.getStatement),
      (action: fromStatementAssignmentModalActions.AssignAllEmployees, filters, statement) =>
        ({action, filters, statementId: statement.StatementId})
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
        PagingOptions: { From: 0, Count: data.action.payload.assignmentMax }
      };

      return this.totalRewardsAssignmentApi.assignAllEmployees(searchRequest).pipe(
        mergeMap((response) => {
          const actions = [];
          actions.push(new fromStatementAssignmentModalActions.AssignAllEmployeesSuccess(response));
          actions.push(new fromStatementAssignmentModalActions.CloseModal());
          actions.push(new fromAssignedEmployeeGridActions.LoadAssignedEmployees());
          return actions;
        }),
        catchError(() => of(new fromStatementAssignmentModalActions.AssignAllEmployeesError()))
      );
    })
  );

  @Effect()
  assignEmployeesSuccess$ = this.actions$
    .pipe(
      ofType(
        fromStatementAssignmentModalActions.ASSIGN_EMPLOYEES_SUCCESS,
        fromStatementAssignmentModalActions.ASSIGN_ALL_EMPLOYEES_SUCCESS
      ),
      mergeMap((action: fromStatementAssignmentModalActions.AssignEmployeesSuccess) =>
        [ new fromStatementAssignmentPageActions.UpdateStatementAssignedEmployees(action.payload) ]
      )
    );

  constructor(
    private store: Store<fromTotalRewardsReducer.State>,
    private totalRewardsAssignmentApi: TotalRewardsAssignmentApiService,
    private payfactorsSearchApiHelper: PayfactorsSearchApiHelper,
    private actions$: Actions
  ) {}
}
