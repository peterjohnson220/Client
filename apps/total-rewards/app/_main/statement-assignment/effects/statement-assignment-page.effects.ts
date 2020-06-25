import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, mergeMap, catchError, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

import { TotalRewardsApiService, TotalRewardsPdfGenerationService, TotalRewardsSearchApiService } from 'libs/data/payfactors-api/total-rewards';
import { CompanyEmployee } from 'libs/models/company';

import { Statement } from '../../../shared/models';
import * as fromStatementAssignmentPageActions from '../actions/statement-assignment.page.actions';
import * as fromTotalRewardsReducer from '../reducers';

@Injectable()
export class StatementAssignmentPageEffects {

  @Effect()
  loadStatement$ = this.actions$
    .pipe(
      ofType(fromStatementAssignmentPageActions.LOAD_STATEMENT),
      switchMap((action: fromStatementAssignmentPageActions.LoadStatement) =>
        this.totalRewardsApi.getStatementFromId(action.payload.statementId).pipe(
          map((response: Statement) => new fromStatementAssignmentPageActions.LoadStatementSuccess(response)),
          catchError(error => of(new fromStatementAssignmentPageActions.LoadStatementError(error)))
        )
      )
    );

  @Effect()
  generateStatements$ = this.actions$
    .pipe(
      ofType(fromStatementAssignmentPageActions.GENERATE_STATEMENTS),
      withLatestFrom(
        this.store.select(fromTotalRewardsReducer.getStatement),
        this.store.select(fromTotalRewardsReducer.getAssignmentsGridSelectedCompanyEmployeeIds),
        (action: fromStatementAssignmentPageActions.GenerateStatements, statement, companyEmployeeIds) =>
          ({ action, companyEmployeeIds, statementId: statement.StatementId })
      ),
      switchMap((combined) =>
        this.totalRewardsPdfGenerationService.generateStatements({ CompanyEmployeeIds: combined.companyEmployeeIds, StatementId: combined.statementId }).pipe(
          mergeMap(() => [
            new fromStatementAssignmentPageActions.GenerateStatementsSuccess(),
            new fromStatementAssignmentPageActions.CloseGenerateStatementModal()
          ]),
          catchError(error => of(new fromStatementAssignmentPageActions.GenerateStatementsError(error)))
        )
      )
    );

  @Effect()
  getAssignedEmployees$ = this.actions$.pipe(
    ofType(fromStatementAssignmentPageActions.GET_ASSIGNED_EMPLOYEES),
    withLatestFrom(
      this.store.select(fromTotalRewardsReducer.getStatement),
      (action, statement) => ({action, statementId: statement.StatementId})
    ),
    switchMap(
      (data) => {
        const request = {
          StatementId: data.statementId
        };
        return this.TotalRewardsSearchApi.getAssignedEmployees(request).pipe(
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
    private actions$: Actions,
    private totalRewardsApi: TotalRewardsApiService,
    private TotalRewardsSearchApi: TotalRewardsSearchApiService,
    private totalRewardsPdfGenerationService: TotalRewardsPdfGenerationService,
    private store: Store<fromTotalRewardsReducer.State>) {}
}
