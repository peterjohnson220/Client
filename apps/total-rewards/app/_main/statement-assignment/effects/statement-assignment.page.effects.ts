import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

import { TotalRewardsAssignmentApiService } from 'libs/data/payfactors-api/total-rewards';
import { CompanyEmployee } from 'libs/models/company';

import * as fromStatementAssignmentPageActions from '../actions/statement-assignment.page.actions';
import * as fromTotalRewardsReducer from '../reducers';

@Injectable()
export class StatementAssignmentPageEffects {

  @Effect()
  getAssignedEmployees$ = this.actions$.pipe(
    ofType(fromStatementAssignmentPageActions.GET_ASSIGNED_EMPLOYEES),
    withLatestFrom(
      this.store.select(fromTotalRewardsReducer.getSelectedCompanyEmployeeIds),
      this.store.select(fromTotalRewardsReducer.getStatementId),
      (action, employees, statementId) => ({action, employees, statementId})
    ),
    switchMap(
      (data) => {
        const request = {
          CompanyEmployeeIds: data.employees,
          StatementId: data.statementId
        };
        return this.totalRewardsAssignmentApi.getAssignedEmployees(request).pipe(
          mergeMap(
            (response: CompanyEmployee[]) => {
              const actions = [];
              actions.push(new fromStatementAssignmentPageActions.GetAssignedEmployeesSuccess());
              actions.push(new fromStatementAssignmentPageActions.ReplaceAssignedEmployees(response));

              return actions;
            }
          ),
          catchError(() => of(new fromStatementAssignmentPageActions.GetAssignedEmployeesError()))
        );
      }
    )
  );

  constructor(
    private store: Store<fromTotalRewardsReducer.State>,
    private totalRewardsAssignmentApi: TotalRewardsAssignmentApiService,
    private actions$: Actions
  ) {}
}
