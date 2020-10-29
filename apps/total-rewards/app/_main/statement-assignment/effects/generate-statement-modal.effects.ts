import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { TotalRewardsApiService } from 'libs/data/payfactors-api/total-rewards';

import * as fromGenerateStatementModalActions from '../actions/generate-statement-modal.actions';

@Injectable()
export class GenerateStatementModalEffects {

  @Effect()
  getStatementEmailTemplates$ = this.actions$
    .pipe(
      ofType(fromGenerateStatementModalActions.GET_STATEMENT_EMAIL_TEMPLATE),
      switchMap((action: fromGenerateStatementModalActions.GetStatementEmailTemplate) => {
        return this.totalRewardsApi.getStatementEmailTemplate(action.payload.statementId)
          .pipe(
            map((response) => new fromGenerateStatementModalActions.GetStatementEmailTemplateSuccess(response)),
            catchError(() => of(new fromGenerateStatementModalActions.GetStatementEmailTemplateError()))
          );
      })
    );

  @Effect()
  saveStatementEmailTemplate$ = this.actions$
    .pipe(
      ofType(fromGenerateStatementModalActions.SAVE_STATEMENT_EMAIL_TEMPLATE),
      switchMap((action: fromGenerateStatementModalActions.SaveStatementEmailTemplate) => {
        return this.totalRewardsApi.saveStatementEmailTemplate(action.payload)
          .pipe(
            map(() => new fromGenerateStatementModalActions.SaveStatementEmailTemplateSuccess(action.payload)),
            catchError(() => of(new fromGenerateStatementModalActions.SaveStatementEmailTemplateError()))
          );
      })
    );

  constructor(
      private actions$: Actions,
      private totalRewardsApi: TotalRewardsApiService
  ) {}
}
