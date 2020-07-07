import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { TotalRewardsSearchApiService } from 'libs/data/payfactors-api/total-rewards';

import * as fromAssignedEmployeesGridActions from '../actions/assigned-employees-grid.actions';
import * as fromTotalRewardsReducer from '../reducers';

@Injectable()
export class AssignedEmployeesGridEffects {

  @Effect()
  getAssignedEmployees$ = this.actions$.pipe(
    ofType(fromAssignedEmployeesGridActions.LOAD_ASSIGNED_EMPLOYEES),
    withLatestFrom(
      this.store.select(fromTotalRewardsReducer.getStatement),
      (action: fromAssignedEmployeesGridActions.LoadAssignedEmployees, statement) => ({ action, statementId: statement.StatementId })
    ),
    switchMap(combined =>
      this.totalRewardsSearchApi.getAssignedEmployees({ StatementId: combined.statementId, GridListState: combined.action.payload }).pipe(
        map((response: GridDataResult) => new fromAssignedEmployeesGridActions.LoadAssignedEmployeesSuccess(response)),
        catchError(() => of(new fromAssignedEmployeesGridActions.LoadAssignedEmployeesError()))
      )
    )
  );

  constructor(
    private actions$: Actions,
    private totalRewardsSearchApi: TotalRewardsSearchApiService,
    private store: Store<fromTotalRewardsReducer.State>) {}
}
