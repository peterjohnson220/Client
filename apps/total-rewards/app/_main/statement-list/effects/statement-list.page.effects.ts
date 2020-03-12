import { Injectable } from '@angular/core';

import { select, Action, Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap, withLatestFrom } from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { TotalRewardsApiService } from 'libs/data/payfactors-api/total-rewards';

import * as fromStatementsActions from '../actions/statement-list.page.actions';
import * as fromTotalRewardsReducer from '../reducers';

@Injectable()
export class StatementListPageEffects {

  @Effect()
  loadStatements$: Observable<Action> = this.actions$.pipe(
    ofType(fromStatementsActions.LOAD_STATEMENTS),
    withLatestFrom(
      this.store.pipe(
        select(fromTotalRewardsReducer.getStatementListSearchTerm)),
      (action, searchTerm: string) => searchTerm
    ),
    switchMap(searchTerm => this.totalRewardsApiService.getStatements(searchTerm).pipe(
      map((statements: GridDataResult) => {
        return new fromStatementsActions.LoadStatementsSuccess(statements);
      }),
      catchError(() => of(new fromStatementsActions.LoadStatementsError()))
      )
    ));

  constructor(
    private store: Store<fromTotalRewardsReducer.State>,
    private actions$: Actions,
    private totalRewardsApiService: TotalRewardsApiService) {}
}
