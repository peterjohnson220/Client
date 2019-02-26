import { Injectable } from '@angular/core';

import { Effect, Actions } from '@ngrx/effects';

import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import { ComphubApiService } from 'libs/data/payfactors-api/comphub';

import * as fromComphubPageActions from '../actions/comphub-page.actions';
import * as fromSummaryCardActions from '../actions/summary-card.actions';
import * as fromDataCardActions from '../actions/data-card.actions';
import * as fromMarketsCardActions from '../actions/markets-card.actions';
import * as fromJobsCardActions from '../actions/jobs-card.actions';
import { ComphubPages } from '../data';
import { PayfactorsApiModelMapper } from '../helpers';

@Injectable()
export class SummaryCardEffects {

  @Effect()
  priceNewJob$ = this.actions$
    .ofType(fromSummaryCardActions.PRICE_NEW_JOB)
    .pipe(
      mergeMap(() => [
        new fromComphubPageActions.NavigateToCard({cardId: ComphubPages.Jobs }),
        new fromComphubPageActions.ResetAccessiblePages(),
        new fromComphubPageActions.ResetPagesAccessed(),
        new fromJobsCardActions.ClearSelectedJob(),
        new fromMarketsCardActions.SetToDefaultPaymarket(),
        new fromDataCardActions.ClearSelectedJobData()
      ])
    );

  @Effect()
  getJobNationalTrend$ = this.actions$
    .ofType(fromSummaryCardActions.GET_JOB_NATIONAL_TREND)
    .pipe(
      switchMap((action: fromSummaryCardActions.GetNationalJobTrendData) => {
          return this.comphubApiService.getJobSalaryTrendData({
            JobCode: action.payload.JobCode,
            CountryCode: 'USA'
          })
            .pipe(
              map(response => {
                const salaryTrendData = PayfactorsApiModelMapper.mapJobSalaryTrendToTrendData(response);
                return new fromSummaryCardActions.GetNationalJobTrendDataSuccess(salaryTrendData);
              }),
              catchError((error) => of(new fromSummaryCardActions.GetNationalJobTrendDataError(),
                new fromComphubPageActions.HandleApiError(error)))
            );
        }
      ));

  constructor(
    private actions$: Actions,
    private comphubApiService: ComphubApiService,
  ) {}
}
