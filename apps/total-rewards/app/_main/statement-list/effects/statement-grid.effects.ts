import { Injectable } from '@angular/core';

import { select, Action, Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap, concatMap, mergeMap, withLatestFrom } from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { TotalRewardsApiService } from 'libs/data/payfactors-api/total-rewards';

import * as fromStatementGridActions from '../actions/statement-grid.actions';
import * as fromTotalRewardsReducer from '../reducers';
import { StatementListViewModel } from '../../../shared/models';

@Injectable()
export class StatementGridEffects {

  @Effect()
  loadStatements$: Observable<Action> = this.actions$.pipe(
    ofType(fromStatementGridActions.LOAD_STATEMENTS),
    withLatestFrom(
      this.store.pipe(
        select(fromTotalRewardsReducer.getStatementsSearchTerm)),
      (action, searchTerm: string) => searchTerm
    ),
    switchMap(searchTerm => this.totalRewardsApiService.getStatements(searchTerm).pipe(
      map((statements: GridDataResult) => {
        return new fromStatementGridActions.LoadStatementsSuccess(statements);
      }),
      catchError(() => of(new fromStatementGridActions.LoadStatementsError()))
      )
    ));

  @Effect()
  deleteStatement$: Observable<Action> = this.actions$.pipe(
    ofType(fromStatementGridActions.DELETE_STATEMENT),
    withLatestFrom(
      this.store.pipe(
        select(fromTotalRewardsReducer.getStatementsOpenActionMenuStatement)),
        (action, statement: StatementListViewModel) => statement.Id
    ),
    concatMap((statementId: string) => this.totalRewardsApiService.deleteStatement(statementId).pipe(
      mergeMap(() => [
        new fromStatementGridActions.CloseDeleteStatement(),
        new fromStatementGridActions.DeleteStatementSuccess(),
        new fromStatementGridActions.LoadStatements()
      ]),
      catchError(() => of(new fromStatementGridActions.DeleteStatementError()))
      )
    ));

  constructor(
    private store: Store<fromTotalRewardsReducer.State>,
    private actions$: Actions,
    private totalRewardsApiService: TotalRewardsApiService) {}
}
