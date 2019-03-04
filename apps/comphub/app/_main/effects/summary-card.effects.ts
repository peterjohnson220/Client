import { Injectable } from '@angular/core';

import { Effect, Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { ComphubApiService } from 'libs/data/payfactors-api';
import { CreateQuickPriceProjectRequest } from 'libs/models/payfactors-api';

import * as fromComphubPageActions from '../actions/comphub-page.actions';
import * as fromSummaryCardActions from '../actions/summary-card.actions';
import * as fromDataCardActions from '../actions/data-card.actions';
import * as fromMarketsCardActions from '../actions/markets-card.actions';
import * as fromJobsCardActions from '../actions/jobs-card.actions';
import { ComphubPages } from '../data';
import { DataCardHelper, PayfactorsApiModelMapper } from '../helpers';
import { WindowRef } from '../services';
import * as fromComphubMainReducer from '../reducers';

@Injectable()
export class SummaryCardEffects {

  private projectWindow;

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
        new fromDataCardActions.ClearSelectedJobData(),
        new fromSummaryCardActions.ResetCreateProjectStatus()
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

  @Effect()
  sharePricingSummary$ = this.actions$
  .ofType(fromSummaryCardActions.SHARE_PRICING_SUMMARY)
  .pipe(
    switchMap((action: fromSummaryCardActions.SharePricingSummary) => {
      return this.comphubApiService.sharePricingSummary(action.payload)
        .pipe(
          map(() => new fromSummaryCardActions.CloseShareModal),
          catchError((response) => {
            return of(response.status === 400
              ? new fromSummaryCardActions.SharePricingSummaryConflict()
              : new fromSummaryCardActions.SharePricingSummaryError(),
              new fromComphubPageActions.HandleApiError(response));
          })
        );
    })
  );

  @Effect()
  createQuickPriceProject$ = this.actions$
    .ofType(fromSummaryCardActions.CREATE_PROJECT)
    .pipe(
      withLatestFrom(
        this.store.select(fromComphubMainReducer.getSelectedJobData),
        this.store.select(fromComphubMainReducer.getSelectedPaymarket),
        this.store.select(fromComphubMainReducer.getSelectedRate),
        (action: fromSummaryCardActions.CreateProject, job, payMarket, rate) => (
          { action, job, payMarket, rate }
        )),
      switchMap((data) => {
        const quickPriceRequest: CreateQuickPriceProjectRequest = {
            JobCode: data.job.JobCode,
            CompanyPayMarketId: data.payMarket.CompanyPayMarketId,
            Currency: 'USD',
            Rate: data.rate,
            ProjectTitle: data.job.JobTitle,
            EffectiveDate: DataCardHelper.firstDayOfMonth()
        };
        this.projectWindow = this.winRef.nativeWindow.open('', '_blank');
        return this.comphubApiService.createQuickPriceProject(quickPriceRequest).pipe(
          map((response: number) =>
            new fromSummaryCardActions.CreateProjectSuccess(response)
          ),
          catchError((error) => of(new fromSummaryCardActions.CreateProjectError(), new fromComphubPageActions.HandleApiError(error)))
        );
      })
    );

  @Effect({dispatch: false})
  createProjectSuccess$ = this.actions$
    .ofType(fromSummaryCardActions.CREATE_PROJECT_SUCCESS)
    .pipe(
      tap((action: fromSummaryCardActions.CreateProjectSuccess) => {
        this.projectWindow.location.href = `/marketdata/marketdata.asp?usersession_id=${action.payload}`;
        this.projectWindow.focus();
      })
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromComphubMainReducer.State>,
    private comphubApiService: ComphubApiService,
    private winRef: WindowRef
  ) {}
}
