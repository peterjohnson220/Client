import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map,  catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { TotalRewardsApiService } from 'libs/data/payfactors-api/total-rewards';

import { StatementForPrint } from '../../../shared/models';
import * as fromPageActions from '../actions/statement-print.page.actions';

@Injectable()
export class StatementPrintPageEffects {
  @Effect()
  loadStatement$ = this.actions$
    .pipe(
      ofType(fromPageActions.LOAD_STATEMENT),
      switchMap((action: fromPageActions.LoadStatement) =>
        this.totalRewardsApi.getStatementForPrint(action.payload).pipe(
          map((response: StatementForPrint) => {
            response.EmployeeRewardsData.map(e => {
              if (e.EmployeeDOB) {
                e.EmployeeDOB = new Date(e.EmployeeDOB);
              }
              if (e.EmployeeDOH) {
                e.EmployeeDOH = new Date(e.EmployeeDOH);
              }
            });
            return new fromPageActions.LoadStatementSuccess(response);
          }),
          catchError(() => of(new fromPageActions.LoadStatementError()))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private totalRewardsApi: TotalRewardsApiService
  ) { }
}
