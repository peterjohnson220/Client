import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

import { Statement } from 'libs/features/total-rewards/total-rewards-statement/models';
import { TotalRewardsApiService, TotalRewardsStatementHistoryApiService } from 'libs/data/payfactors-api';
import { StatementHistoryListResponse } from 'libs/models/payfactors-api/total-rewards/response/statement-history-list-response.model';

import * as fromStatementHistoryPageActions from '../../statement-history/actions/statement-history.page.actions';
import * as fromTotalRewardsReducer from '../reducers';

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

    @Effect()
    loadStatementHistory$ = this.actions$
      .pipe(
        ofType(fromStatementHistoryPageActions.LOAD_STATEMENT_HISTORY),
        withLatestFrom(
          this.store.pipe(select(fromTotalRewardsReducer.getStatement)),
          this.store.pipe(select(fromTotalRewardsReducer.getStatementHistoryGridState)),
          (action: fromStatementHistoryPageActions.LoadStatementHistory, statement: Statement, gridState) => ({ statement, gridState })),
          switchMap(gridData =>
            this.totalRewardsStatementHistoryApi.getStatementHistory({
              StatementId: gridData.statement.StatementId,
              Count: gridData.gridState.take,
              From: gridData.gridState.skip,
              SortBy: gridData.gridState.sort?.length ? gridData.gridState.sort[0].field : null,
              SortDirection: gridData.gridState.sort?.length ? gridData.gridState.sort[0].dir : null
            }).pipe(
              map((response: StatementHistoryListResponse) => new fromStatementHistoryPageActions.LoadStatementHistorySuccess(response)),
              catchError(error => of(new fromStatementHistoryPageActions.LoadStatementHistoryError(error)))
            )
          )
      );

  constructor(
    private actions$: Actions,
    private totalRewardsApi: TotalRewardsApiService,
    private totalRewardsStatementHistoryApi: TotalRewardsStatementHistoryApiService,
    private store: Store<fromTotalRewardsReducer.State>
  ) {}
}
