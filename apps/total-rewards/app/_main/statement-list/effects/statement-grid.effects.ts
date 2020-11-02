import { Injectable } from '@angular/core';

import { select, Action, Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap, concatMap, mergeMap, withLatestFrom } from 'rxjs/operators';

import { TotalRewardsApiService } from 'libs/data/payfactors-api/total-rewards';
import { StatementListResponse } from 'libs/models/payfactors-api/total-rewards/response';
import { GridTypeEnum } from 'libs/models/common';
import * as fromGridActions from 'libs/core/actions/grid.actions';
import { StatementListViewModel } from 'libs/features/total-rewards/total-rewards-statement/models';

import * as fromStatementGridActions from '../actions/statement-grid.actions';
import * as fromTotalRewardsReducer from '../reducers';

@Injectable()
export class StatementGridEffects {

  @Effect()
  updateSearchTerm$ = this.actions$.pipe(
    ofType(fromStatementGridActions.UPDATE_SEARCH_TERM),
    withLatestFrom(
      this.store.pipe(select(fromTotalRewardsReducer.getStatementsSearchTerm)),
      this.store.pipe(select(fromTotalRewardsReducer.getStatementsGridState)),
      (action: fromStatementGridActions.LoadStatements, searchTerm: string, gridState) => ({ searchTerm, gridState })
    ),
      mergeMap((gridData) => [
        new fromGridActions.PageChange(GridTypeEnum.TotalRewardsStatements, { skip: 0, take: gridData.gridState.take }),
        new fromStatementGridActions.LoadStatements()
      ])
    );

  @Effect()
  loadStatements$: Observable<Action> = this.actions$.pipe(
    ofType(fromStatementGridActions.LOAD_STATEMENTS),
    withLatestFrom(
      this.store.pipe(select(fromTotalRewardsReducer.getStatementsSearchTerm)),
      this.store.pipe(select(fromTotalRewardsReducer.getStatementsGridState)),
      (action: fromStatementGridActions.LoadStatements, searchTerm: string, gridState) => ({ searchTerm, gridState })
    ),
    switchMap((gridData) => this.totalRewardsApiService.getStatements({
        Count: gridData.gridState.take,
        From: gridData.gridState.skip,
        SearchTerm: gridData.searchTerm,
        SortBy: gridData.gridState.sort?.length ?  gridData.gridState.sort[0].field : null,
        SortDirection: gridData.gridState.sort?.length ?  gridData.gridState.sort[0].dir : null
      }).pipe(
      map((statements: StatementListResponse) => {
        return new fromStatementGridActions.LoadStatementsSuccess({
          total: statements.TotalCount,
          data: statements.Data
        });
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
