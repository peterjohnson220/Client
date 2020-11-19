import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { switchMap, map,  catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { TotalRewardsApiService } from 'libs/data/payfactors-api/total-rewards';
import { CompanyEmployeeApiService } from 'libs/data/payfactors-api/company';
import { Statement } from 'libs/features/total-rewards/total-rewards-statement/models';
import { EmployeeRewardsDataService } from 'libs/features/total-rewards/total-rewards-statement/services/employee-rewards-data.service';
import { EmployeeRewardsDataRequest } from 'libs/models/payfactors-api/total-rewards/request';

import * as fromPageActions from '../actions/statement-view.page.actions';

@Injectable()
export class StatementViewPageEffects {
  @Effect()
  getStatement$: Observable<Action> =
    this.actions$.pipe(
      ofType(fromPageActions.LOAD_STATEMENT),
      switchMap((action: fromPageActions.LoadStatement) =>
        this.totalRewardsApiService.getStatementFromId(action.payload).pipe(
          map((response: Statement) => new fromPageActions.LoadStatementSuccess(response)),
          catchError(error => of(new fromPageActions.LoadStatementError(error)))
        ))
    );

  @Effect()
  getBenefits$ = this.actions$
    .pipe(
      ofType(fromPageActions.GET_EMPLOYEE_REWARDS_DATA),
      switchMap((action: fromPageActions.GetEmployeeRewardsData) => {
        const request: EmployeeRewardsDataRequest = {
          CompanyEmployeeId: action.payload.companyEmployeeId,
          StatementId: action.payload.statementId
        };
        return this.companyEmployeeApiService.getBenefits(request)
          .pipe(
            map((response) => {
              return new fromPageActions.GetEmployeeRewardsDataSuccess(EmployeeRewardsDataService.mapEmployeeRewardsDataDateFields(response));
            }),
            catchError(() => of(new fromPageActions.GetEmployeeRewardsDataError()))
          );
      })
    );
  constructor(
    private actions$: Actions,
    private totalRewardsApiService: TotalRewardsApiService,
    private companyEmployeeApiService: CompanyEmployeeApiService
  ) { }
}
