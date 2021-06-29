import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { Statement } from 'libs/features/total-rewards/total-rewards-statement/models';
import { TotalRewardsApiService } from 'libs/data/payfactors-api';

import * as fromStatementHistoryPageActions from '../../statement-history/actions/statement-history.page.actions';

@Injectable()
export class StatementHistoryPageEffects {
  @Effect()
  loadStatement$ = this.actions$
    .pipe(
      ofType(fromStatementHistoryPageActions.LOAD_STATEMENT),
      switchMap((action: fromStatementHistoryPageActions.LoadStatement) =>
        this.totalRewardsApi.getStatementFromId(action.payload.statementId).pipe(
          map((response: Statement) => new fromStatementHistoryPageActions.LoadStatementSuccess(response)),
          catchError(error => of(new fromStatementHistoryPageActions.LoadStatementError(error)))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private totalRewardsApi: TotalRewardsApiService,
  ) {}
}
