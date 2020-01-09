import { Injectable } from '@angular/core';

import { select, Action, Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap, filter, withLatestFrom, debounceTime } from 'rxjs/operators';

import { TotalRewardsApiService } from 'libs/data/payfactors-api/total-rewards';

import * as fromCreateNewStatementActions from '../actions/create-new-statement.actions';
import * as fromTotalRewardsReducer from '../reducers';

@Injectable()
export class CreateNewStatementEffects {

  @Effect()
  validateStatementName$: Observable<Action> = this.actions$.pipe(
    ofType(fromCreateNewStatementActions.VALIDATE_STATEMENT_NAME),
    debounceTime(300),
    withLatestFrom(
      this.store.pipe(
        select(fromTotalRewardsReducer.getCreateNewStatementName)),
        (action, statementName: string) => statementName
    ),
    filter((statementName: string) => !!statementName),
    switchMap(statementName => this.totalRewardsApiService.validateStatementName(statementName).pipe(
      map((isValid: boolean) => new fromCreateNewStatementActions.ValidateStatementNameSuccess(isValid)),
      catchError(() => of(new fromCreateNewStatementActions.ValidateStatementNameError()))
    )
  ));

  @Effect()
  createStatement$: Observable<Action> = this.actions$.pipe(
    ofType(fromCreateNewStatementActions.CREATE),
    // grab the name and templateId to send to the back end
    withLatestFrom(
      this.store.pipe(select(fromTotalRewardsReducer.getCreateNewStatementName)),
      this.store.pipe(select(fromTotalRewardsReducer.getCreateNewStatementTemplateId)),
      (action, name, templateId) => ({ Name: name, TemplateId: +templateId })
    ),
    switchMap(nameAndTemplateId => this.totalRewardsApiService.createStatement(nameAndTemplateId).pipe(
      map((statementId: number) => new fromCreateNewStatementActions.CreateSuccess(statementId)),
      catchError(() => of(new fromCreateNewStatementActions.CreateError()))
    )
  ));

  constructor(
    private store: Store<fromTotalRewardsReducer.State>,
    private actions$: Actions,
    private totalRewardsApiService: TotalRewardsApiService) { }
}
