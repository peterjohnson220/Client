import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';

import { NotificationsApiService } from 'libs/data/payfactors-api';

import * as fromTotalRewardsStatementPdfActions from '../actions/total-rewards-statement-pdf.actions';
import { TotalRewardsStatementPdf } from '../models';

@Injectable()
export class TotalRewardsStatementPdfEffects {

  @Effect()
  getTotalRewardsStatementPdfs$ = this.actions$
    .pipe(
      ofType(fromTotalRewardsStatementPdfActions.GET_TOTAL_REWARDS_STATEMENT_PDFS),
      switchMap(() => {
        return this.notificationApiService.getTotalRewardsStatementPdfs()
          .pipe(
            map((response: TotalRewardsStatementPdf[]) => new fromTotalRewardsStatementPdfActions.GetTotalRewardsStatementPdfsSuccess(response)),
            catchError(() => of(new fromTotalRewardsStatementPdfActions.GetTotalRewardsStatementPdfsError()))
          );
      })
    );

  constructor(
    private actions$: Actions,
    private notificationApiService: NotificationsApiService
  ) {}
}
