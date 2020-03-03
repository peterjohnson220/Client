import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { Store, Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { TotalRewardsApiService} from 'libs/data/payfactors-api/total-rewards';

import * as fromTotalRewardsReducer from '../reducers';
import * as fromTotalRewardsStatementEditActions from '../actions';
import { Statement } from '../../../shared/models';

@Injectable()
export class StatementEditPageEffects {

  @Effect()
  getStatement$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromTotalRewardsStatementEditActions.LOAD_STATEMENT),
      switchMap((action: fromTotalRewardsStatementEditActions.LoadStatement) =>
      this.totalRewardsApiService.getStatementFromId(action.payload).pipe(
        map((response: Statement) => new fromTotalRewardsStatementEditActions.LoadStatementSuccess(response)),
        catchError(error => of(new fromTotalRewardsStatementEditActions.LoadStatementError(error)))
      ))
    );

  constructor(
    private store: Store<fromTotalRewardsReducer.State>,
    private actions$: Actions,
    private totalRewardsApiService: TotalRewardsApiService) {}
}
