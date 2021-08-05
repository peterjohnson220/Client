import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { WindowRef } from 'libs/core/services';
import { ComphubApiService } from 'libs/data/payfactors-api';
import { CreateQuickPriceProjectRequest, AddCompletedPricingHistoryRequest } from 'libs/models/payfactors-api';
import * as fromNavigationActions from 'libs/ui/layout-wrapper/actions/left-sidebar.actions';
import * as fromBasicDataGridActions from 'libs/features/grids/basic-data-grid/actions/basic-data-grid.actions';
import * as fromFeatureFlagRedirectReducer from 'libs/state/state';
import { UrlPage } from 'libs/models/url-redirect/url-page';
import { UrlRedirectHelper } from 'libs/core/helpers/url-redirect-helper';

import * as fromComphubPageActions from '../actions/comphub-page.actions';
import * as fromSummaryCardActions from '../actions/summary-card.actions';
import * as fromDataCardActions from '../actions/data-card.actions';
import * as fromMarketsCardActions from '../actions/markets-card.actions';
import * as fromJobsCardActions from '../actions/jobs-card.actions';
import * as fromComphubSharedReducer from '../reducers';
import * as fromJobGridActions from '../actions/job-grid.actions';
import { DataCardHelper, PayfactorsApiModelMapper } from '../helpers';
import { ComphubPages } from '../data';
import { QuickPriceHistoryContext } from '../models';


@Injectable()
export class SummaryCardEffects {

  private projectWindow;

  @Effect()
  priceNewJob$ = this.actions$
    .pipe(
      ofType(fromSummaryCardActions.PRICE_NEW_JOB),
      mergeMap(() => [
        new fromComphubPageActions.NavigateToCard({cardId: ComphubPages.Jobs }),
        new fromComphubPageActions.ResetAccessiblePages(),
        new fromComphubPageActions.ResetPagesAccessed(),
        new fromJobsCardActions.ClearSelectedJob(),
        new fromMarketsCardActions.SetToDefaultPaymarket(),
        new fromComphubPageActions.ClearSelectedJobData(),
        new fromSummaryCardActions.ResetCreateProjectStatus(),
        new fromBasicDataGridActions.GetCount(QuickPriceHistoryContext.gridId)
      ])
    );

  @Effect()
  getJobNationalTrend$ = this.actions$
    .pipe(
      ofType(fromSummaryCardActions.GET_JOB_NATIONAL_TREND),
      switchMap((action: fromSummaryCardActions.GetNationalJobTrendData) => {
          return this.comphubApiService.getJobSalaryTrendData({
            JobCode: action.payload.jobCode,
            CountryCode: action.payload.countryCode
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
  .pipe(
    ofType(fromSummaryCardActions.SHARE_PRICING_SUMMARY),
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
    .pipe(
      ofType(fromSummaryCardActions.CREATE_PROJECT),
      withLatestFrom(
        this.store.select(fromComphubSharedReducer.getSelectedJobData),
        this.store.select(fromComphubSharedReducer.getSelectedPaymarket),
        this.store.select(fromComphubSharedReducer.getSelectedRate),
        this.store.select(fromComphubSharedReducer.getActiveCountryDataSet),
        (action: fromSummaryCardActions.CreateProject, job, payMarket, rate, activeCountryDataSet) => (
          { action, job, payMarket, rate, activeCountryDataSet }
        )),
      switchMap((data) => {
        const quickPriceRequest: CreateQuickPriceProjectRequest = {
            JobCode: data.job.JobCode,
            CompanyPayMarketId: data.payMarket.CompanyPayMarketId,
            Currency: data.activeCountryDataSet.CurrencyCode,
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
    .pipe(
      ofType(fromSummaryCardActions.CREATE_PROJECT_SUCCESS),
      withLatestFrom(
        this.store.select(fromFeatureFlagRedirectReducer.getPageRedirectUrl, {page: UrlPage.PricingProject}),
        (action: fromSummaryCardActions.CreateProjectSuccess, redirectUrl: string) => ({action, redirectUrl})
      ),
      tap((data: any) => {
        this.projectWindow.location.href = UrlRedirectHelper.getIdParamUrl(data.redirectUrl, data.action.payload.toString());
        this.projectWindow.focus();
      })
    );

  @Effect({dispatch: false})
  createProjectError$ = this.actions$
    .pipe(
      ofType(fromSummaryCardActions.CREATE_PROJECT_ERROR),
      tap(() => {
        this.projectWindow.close();
      })
    );

  @Effect()
  getLeftSidebarNavigationLinksSuccess$ = this.actions$
    .pipe(
      ofType(fromNavigationActions.GET_LEFT_SIDEBAR_NAVIGATION_LINKS_SUCCESS),
      map((action: fromNavigationActions.GetLeftSidebarNavigationLinksSuccess) => {
        const hasAccessToProjectsTile = action.payload && action.payload.some(l => l.Name === 'Pricing Projects');
        return new fromSummaryCardActions.SetProjectTileAccess(hasAccessToProjectsTile);
      })
    );

  @Effect()
  addCompletedPricingHistory$ = this.actions$
  .pipe(
    ofType(fromSummaryCardActions.ADD_COMPLETED_PRICING_HISTORY),
    withLatestFrom(
      this.store.select(fromComphubSharedReducer.getSelectedJob),
      this.store.select(fromComphubSharedReducer.getSelectedPaymarket),
      this.store.select(fromComphubSharedReducer.getActiveCountryDataSet),
      (action: fromSummaryCardActions.AddCompletedPricingHistory, selectedJob, selectedPayMarket, countryDataSet) =>
        ({ action, selectedJob, selectedPayMarket, countryDataSet })
    ),
    switchMap((data) => {
      const request: AddCompletedPricingHistoryRequest = {
        JobTitleShort: data.selectedJob,
        JobTitle: data.action.payload.JobTitle,
        JobCode: data.action.payload.JobCode,
        CountryCode: data.countryDataSet.CountryCode,
        CompanyPayMarketId: data.selectedPayMarket.CompanyPayMarketId,
        Base25: data.action.payload.Base25,
        Base50: data.action.payload.Base50,
        Base75: data.action.payload.Base75,
        Tcc25: data.action.payload.Tcc25,
        Tcc50: data.action.payload.Tcc50,
        Tcc75: data.action.payload.Tcc75
      };
      return this.comphubApiService.addCompletedPricingHistory(request)
        .pipe(
          map(() => new fromSummaryCardActions.AddCompletedPricingHistorySuccess()),
          catchError((error) => of(
            new fromSummaryCardActions.AddCompletedPricingHistoryError(),
            new fromComphubPageActions.HandleApiError(error))
          )
        );
    })
  );

  @Effect()
  priceNewPeerJob$ = this.actions$
    .pipe(
      ofType(fromSummaryCardActions.PRICE_NEW_PEER_JOB),
      mergeMap(() => [
        new fromComphubPageActions.NavigateToCard({ cardId: ComphubPages.Jobs }),
        new fromComphubPageActions.ResetAccessiblePages(),
        new fromComphubPageActions.ResetPagesAccessed(),
        new fromJobsCardActions.ClearSelectedJob(),
        new fromMarketsCardActions.SetDefaultPaymarketAsSelected(),
        new fromComphubPageActions.ClearSelectedJobData(),
        new fromDataCardActions.SetForceRefreshPeerMap(true),
        new fromSummaryCardActions.ResetCreateProjectStatus(),
        new fromBasicDataGridActions.GetCount(QuickPriceHistoryContext.gridId)
      ])
    );

  @Effect()
  recalculateJobData$ = this.actions$
    .pipe(
      ofType(fromSummaryCardActions.RECALCULATE_JOB_DATA),
      withLatestFrom(
        this.store.select(fromComphubSharedReducer.getActiveCountryDataSet),
        this.store.select(fromComphubSharedReducer.getSelectedPaymarket),
        this.store.select(fromComphubSharedReducer.getSelectedJobData),
        (action: fromJobGridActions.GetQuickPriceMarketData, dataSet, paymarket, jobData) => ({ action, dataSet, paymarket, jobData })
      ),
      switchMap((data) => {
          return this.comphubApiService.getQuickPriceJobData({
            JobId: data.jobData.JobId,
            CompanyPaymarketId: data.paymarket.CompanyPayMarketId,
            CountryCode: data.dataSet.CountryCode
          })
            .pipe(
              mergeMap((response) => {
                const actions = [];
                const jobData = PayfactorsApiModelMapper.mapQuickPriceMarketDataToJobData(response.Data);
                actions.push(new fromComphubPageActions.SetSelectedJobData(jobData));
                actions.push(new fromComphubPageActions.SetJobPricingLimitInfo(response.PricingLimitInfo));
                actions.push(new fromSummaryCardActions.SetMinPaymarketMinimumWage(response.MinPaymarketMinimumWage));
                actions.push(new fromSummaryCardActions.SetMaxPaymarketMinimumWage(response.MaxPaymarketMinimumWage));
                actions.push(new fromSummaryCardActions.RecalculateJobDataSuccess());
                actions.push(new fromSummaryCardActions.AddCompletedPricingHistory(jobData));
                return actions;
              }),
              catchError((error) => of(new fromSummaryCardActions.RecalculateJobDataError(),
                new fromComphubPageActions.HandleApiError(error)))
            );
        }
      ));

  constructor(
    private actions$: Actions,
    private store: Store<fromComphubSharedReducer.State>,
    private comphubApiService: ComphubApiService,
    private winRef: WindowRef
  ) {}
}
