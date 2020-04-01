import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import {catchError, switchMap, map, withLatestFrom, mapTo} from 'rxjs/operators';
import {Store, Action, select} from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { TotalRewardsApiService} from 'libs/data/payfactors-api/total-rewards';

import * as fromTotalRewardsReducer from '../reducers';
import * as fromStatementEditActions from '../actions';
import {Statement, TotalRewardsControlEnum} from '../../../shared/models';
import {SaveStatement} from '../actions';

@Injectable()
export class StatementEditPageEffects {

  @Effect()
  getStatementFromTemplate$: Observable<Action> =
    this.actions$.pipe(
      ofType(fromStatementEditActions.CLONE_STATEMENT_FROM_TEMPLATE),
      switchMap((action: fromStatementEditActions.CloneStatementFromTemplate) =>
        this.totalRewardsApiService.getStatementFromTemplateId(action.templateId).pipe(
          map((response: Statement) => new fromStatementEditActions.CloneStatementFromTemplateSuccess(response)),
          catchError(error => of(new fromStatementEditActions.CloneStatementFromTemplateError(error)))))
    );

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
        // fromStatementEditActions.UPDATE_RICH_TEXT_CONTROL_CONTENT
      ),
      mapTo(new SaveStatement())
    );

  @Effect()
  saveStatement$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromStatementEditActions.SAVE_STATEMENT),
      withLatestFrom(this.store.pipe(select(fromTotalRewardsReducer.selectStatement)),
        (action, statement) => ({action, statement})),
      switchMap((data) =>
         this.totalRewardsApiService.saveStatement(data.statement).pipe(
          map((statement: Statement) => new fromStatementEditActions.SaveStatementSuccess(statement)),
          catchError(error => of(new fromStatementEditActions.SaveStatementError(error)))
        ))
    );

  constructor(
    private store: Store<fromTotalRewardsReducer.State>,
    private actions$: Actions,
    private totalRewardsApiService: TotalRewardsApiService) {}

    map(statement: Statement): Statement {
      statement.Pages.forEach(p => {
        p.Sections.forEach(s => {
          s.Columns.forEach(c => {
            c.Controls.forEach( control => {
              switch (control.ControlType) {
                case TotalRewardsControlEnum.Calculation:
                  control.$type = '$type":"Payfactors.Domain.TotalRewards.LayoutBuilder.Controls.TotalRewardsCalculationControlDto, Payfactors.Domain';
                  break;
                case TotalRewardsControlEnum.CalculationSummary:
                  control.$type = '$type":"Payfactors.Domain.TotalRewards.LayoutBuilder.Controls.TotalRewardsCalculationSummaryControl, Payfactors.Domain';
                  break;
                case TotalRewardsControlEnum.Chart:
                  control.$type = '$type":"Payfactors.Domain.TotalRewards.LayoutBuilder.Controls.TotalRewardsChartControlDto, Payfactors.Domain';
                  break;
                case TotalRewardsControlEnum.Image:
                  control.$type = '$type":"Payfactors.Domain.TotalRewards.LayoutBuilder.Controls.TotalRewardsImageControlDto, Payfactors.Domain';
                  break;
                case TotalRewardsControlEnum.RichTextEditor:
                  control.$type = '$type":"Payfactors.Domain.TotalRewards.LayoutBuilder.Controls.TotalRewardsRichTextControlDto, Payfactors.Domain';
                  break;
                case TotalRewardsControlEnum.Base:
                case TotalRewardsControlEnum.Title:
                default:
                  control.$type = '$type":"Payfactors.Domain.TotalRewards.LayoutBuilder.Controls.TotalRewardsControlDto, Payfactors.Domain';
                  break;
              }
            });
          });
        });
      });
      return statement;
    }
}
