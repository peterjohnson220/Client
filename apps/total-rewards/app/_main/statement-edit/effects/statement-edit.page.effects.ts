import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, switchMap, map, withLatestFrom, mapTo, concatMap } from 'rxjs/operators';
import { Store, Action, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { TotalRewardsApiService } from 'libs/data/payfactors-api/total-rewards';

import * as fromTotalRewardsReducer from '../reducers';
import * as fromStatementEditActions from '../actions';
import { Statement, Settings } from '../../../shared/models';
import { SaveSettingsRequest } from '../../../shared/models/request-models';
import { SaveStatement, SaveSettings } from '../actions';

@Injectable()
export class StatementEditPageEffects {

  @Effect()
  getStatement$: Observable<Action> =
    this.actions$.pipe(
      ofType(fromStatementEditActions.LOAD_STATEMENT),
      switchMap((action: fromStatementEditActions.LoadStatement) =>
        this.totalRewardsApiService.getStatementFromId(action.payload).pipe(
          map((response: Statement) => new fromStatementEditActions.LoadStatementSuccess(response)),
          catchError(error => of(new fromStatementEditActions.LoadStatementError(error)))
        ))
    );

  @Effect()
  public statementChange$: Observable<Action> =
    this.actions$.pipe(
      ofType(
        fromStatementEditActions.UPDATE_STATEMENT_NAME,
        fromStatementEditActions.UPDATE_STATEMENT_CONTROL_TITLE,
        fromStatementEditActions.UPDATE_CALCULATION_CONTROL_FIELD_TITLE,
        fromStatementEditActions.UPDATE_CALCULATION_CONTROL_SUMMARY_TITLE,
        fromStatementEditActions.REMOVE_CALCULATION_CONTROL_COMPENSATION_FIELD,
        fromStatementEditActions.ADD_CALCULATION_CONTROL_COMPENSATION_FIELD,
        fromStatementEditActions.UPDATE_RICH_TEXT_CONTROL_CONTENT,
        fromStatementEditActions.SAVE_IMAGE_CONTROL_IMAGE,
        fromStatementEditActions.UPDATE_EFFECTIVE_DATE
      ),
      mapTo(new SaveStatement())
    );

  @Effect()
  saveStatement$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromStatementEditActions.SAVE_STATEMENT),
      withLatestFrom(this.store.pipe(select(fromTotalRewardsReducer.selectStatement)),
        (action, statement) => ({action, statement})),
      concatMap((data) =>
        this.totalRewardsApiService.saveStatement(data.statement).pipe(
          map((statement: Statement) => new fromStatementEditActions.SaveStatementSuccess(statement)),
          catchError(error => of(new fromStatementEditActions.SaveStatementError(error)))
        ))
    );

  @Effect()
  public settingsChange$: Observable<Action> =
    this.actions$.pipe(
      ofType(
        fromStatementEditActions.UPDATE_SETTINGS_FONT_SIZE,
        fromStatementEditActions.UPDATE_SETTINGS_FONT_FAMILY,
        fromStatementEditActions.UPDATE_SETTINGS_CHART_COLOR
      ),
      mapTo(new SaveSettings())
    );

  @Effect()
  saveSettings$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromStatementEditActions.SAVE_SETTINGS),
      withLatestFrom(
        this.store.pipe(select(fromTotalRewardsReducer.selectStatement)),
        (action, statement: Statement) => statement),
      map(statement => ({ StatementId: statement.StatementId, ...statement.Settings } as SaveSettingsRequest)),
      concatMap((saveSettingsRequest: SaveSettingsRequest) =>
        this.totalRewardsApiService.saveStatementSettings(saveSettingsRequest).pipe(
          map((settings: Settings) => new fromStatementEditActions.SaveSettingsSuccess(settings)),
          catchError(() => of(new fromStatementEditActions.SaveSettingsError()))
        ))
    );

  @Effect()
  resetSettings$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromStatementEditActions.RESET_SETTINGS),
      withLatestFrom(
        this.store.pipe(select(fromTotalRewardsReducer.selectStatement)),
        (action, statement: Statement) => statement),
      concatMap((statement: Statement) =>
        this.totalRewardsApiService.resetStatementSettings(statement.StatementId).pipe(
          map((settings: Settings) => new fromStatementEditActions.SaveSettingsSuccess(settings)),
          catchError(() => of(new fromStatementEditActions.SaveSettingsError()))
        ))
    );

  @Effect()
  removeImage$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromStatementEditActions.REMOVE_IMAGE_CONTROL_IMAGE),
      switchMap((action: fromStatementEditActions.RemoveImageControlImage) =>
        this.totalRewardsApiService.deleteStatementImage(action.payload.FileName).pipe(
          mapTo(new SaveStatement())
        )
      )
    );

  constructor(
    private store: Store<fromTotalRewardsReducer.State>,
    private actions$: Actions,
    private totalRewardsApiService: TotalRewardsApiService) {}
}
