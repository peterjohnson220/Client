import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

import { TotalRewardsSearchApiService } from 'libs/data/payfactors-api/total-rewards';
import { TotalRewardsAssignmentService } from 'libs/features/total-rewards/total-rewards-statement/services/total-rewards-assignment.service';

import * as fromAssignedEmployeesGridActions from '../actions/assigned-employees-grid.actions';
import * as fromTotalRewardsReducer from '../reducers';

@Injectable()
export class AssignedEmployeesGridEffects {

  @Effect()
  getAssignedEmployees$ = this.actions$.pipe(
    ofType(fromAssignedEmployeesGridActions.LOAD_ASSIGNED_EMPLOYEES),
    withLatestFrom(
      this.store.select(fromTotalRewardsReducer.getStatement),
      this.store.select(fromTotalRewardsReducer.getEmployeeSearchTerm),
      (action: fromAssignedEmployeesGridActions.LoadAssignedEmployees, statement, employeeSearchTerm) =>
        ({ payload: action.payload, statementId: statement.StatementId, employeeSearchTerm })
    ),
    map(data => ({
      statementId: data.statementId,
      gridListState: data.payload || TotalRewardsAssignmentService.defaultAssignedEmployeesGridState,
      employeeSearchTerm: data.employeeSearchTerm
    })),
    switchMap(combined => {
      const request = {
        StatementId: combined.statementId,
        EmployeeSearchTerm: combined.employeeSearchTerm,
        GridListState: combined.gridListState
      };
      return this.totalRewardsSearchApi.getAssignedEmployees(request).pipe(
        map((response) => new fromAssignedEmployeesGridActions.LoadAssignedEmployeesSuccess(response)),
        catchError(() => of(new fromAssignedEmployeesGridActions.LoadAssignedEmployeesError()))
      );
    })
  );

  @Effect()
  updateEmployeeSearchTerm$ = this.actions$
    .pipe(
      ofType(fromAssignedEmployeesGridActions.UPDATE_EMPLOYEE_SEARCH_TERM),
      map((action: fromAssignedEmployeesGridActions.UpdateEmployeeSearchTerm) => {
        return new fromAssignedEmployeesGridActions.LoadAssignedEmployees(action.payload.gridState);
      })
    );

  constructor(
    private actions$: Actions,
    private totalRewardsSearchApi: TotalRewardsSearchApiService,
    private store: Store<fromTotalRewardsReducer.State>) {}
}
