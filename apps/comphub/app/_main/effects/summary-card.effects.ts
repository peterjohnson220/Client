import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { WindowRef } from 'libs/core/services';
import { ComphubApiService } from 'libs/data/payfactors-api';
import { CreateQuickPriceProjectRequest, AddCompletedPricingHistoryRequest, JobPricedHistorySummaryResponse } from 'libs/models/payfactors-api';
import * as fromNavigationActions from 'libs/ui/layout-wrapper/actions/left-sidebar.actions';
import * as fromBasicDataGridActions from 'libs/features/basic-data-grid/actions/basic-data-grid.actions';
import * as fromExchangeExplorerMapActions from 'libs/features/peer/exchange-explorer/actions/map.actions';
import * as fromSearchFiltersActions from 'libs/features/search/actions/search-filters.actions';
import * as fromExchangeFilterContextActions from 'libs/features/peer/exchange-explorer/actions/exchange-filter-context.actions';
import { PayfactorsSearchApiModelMapper } from 'libs/features/search/helpers';
import { QuickPriceType } from 'libs/constants';

import * as fromComphubPageActions from '../actions/comphub-page.actions';
import * as fromSummaryCardActions from '../actions/summary-card.actions';
import * as fromDataCardActions from '../actions/data-card.actions';
import * as fromMarketsCardActions from '../actions/markets-card.actions';
import * as fromJobsCardActions from '../actions/jobs-card.actions';

import { ComphubPages } from '../data';
import { DataCardHelper, MarketsCardHelper, PayfactorsApiModelMapper } from '../helpers';
import * as fromComphubMainReducer from '../reducers';
import { QuickPriceHistoryContext } from '../models';
import * as fromJobGridActions from '../actions/job-grid.actions';


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
      withLatestFrom(
        this.store.select(fromComphubMainReducer.getActiveCountryDataSet),
        (action: fromSummaryCardActions.GetNationalJobTrendData, activeCountryDataSet) => ({ action, activeCountryDataSet })
      ),
      switchMap((data) => {
          return this.comphubApiService.getJobSalaryTrendData({
            JobCode: data.action.payload.JobCode,
            CountryCode: data.activeCountryDataSet.CountryCode
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
        this.store.select(fromComphubMainReducer.getSelectedJobData),
        this.store.select(fromComphubMainReducer.getSelectedPaymarket),
        this.store.select(fromComphubMainReducer.getSelectedRate),
        this.store.select(fromComphubMainReducer.getActiveCountryDataSet),
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
      tap((action: fromSummaryCardActions.CreateProjectSuccess) => {
        this.projectWindow.location.href = `/marketdata/marketdata.asp?usersession_id=${action.payload}`;
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
      this.store.select(fromComphubMainReducer.getSelectedJob),
      this.store.select(fromComphubMainReducer.getSelectedPaymarket),
      this.store.select(fromComphubMainReducer.getActiveCountryDataSet),
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
        this.store.select(fromComphubMainReducer.getActiveCountryDataSet),
        this.store.select(fromComphubMainReducer.getSelectedPaymarket),
        this.store.select(fromComphubMainReducer.getSelectedJobData),
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

  @Effect()
  getJobPricedHistorySummary = this.actions$
    .pipe(
      ofType(fromSummaryCardActions.GET_JOB_PRICED_HISTORY_SUMMARY),
      withLatestFrom(
        this.store.select(fromComphubMainReducer.getQuickPriceType),
        (action: fromSummaryCardActions.GetJobPricedHistorySummary, quickPriceType) =>
          ({action, quickPriceType})
      ),
      switchMap((data) => {
        return this.comphubApiService.getJobPricedHistorySummary(data.action.payload)
          .pipe(
            mergeMap((response: JobPricedHistorySummaryResponse) => {
              const actions = [];
              const jobData = PayfactorsApiModelMapper.mapQuickPriceMarketDataToJobData(response);
              if (data.quickPriceType !== QuickPriceType.PEER) {
                const payMarket = !!response.PayMarketDto ?
                  PayfactorsApiModelMapper.mapPaymarketToPricingPayMarket(response.PayMarketDto) : MarketsCardHelper.buildDefaultPricingPayMarket();
                actions.push(new fromMarketsCardActions.SetSelectedPaymarket({
                  paymarket: payMarket,
                  initialLoad: false,
                  quickPriceType: data.quickPriceType
                }));
              } else {
                actions.push(new fromMarketsCardActions.SetDefaultPaymarketAsSelected());
                actions.push(new fromExchangeExplorerMapActions.SetPeerMapBounds({
                  TopLeft: response.ExchangeDataSearchFilterContext.TopLeft,
                  BottomRight: response.ExchangeDataSearchFilterContext.BottomRight,
                  Centroid: null
                }));
                actions.push(new fromExchangeFilterContextActions.SetFilterContext(response.ExchangeDataSearchFilterContext));
                actions.push(new fromExchangeExplorerMapActions.SetMapZoom(response.ExchangeDataSearchFilterContext.ZoomLevel));
                let filters = this.payfactorsSearchApiModelMapper.mapSearchFiltersToFilters(response.Filters, response.SearchFilterMappingData);
                filters = PayfactorsApiModelMapper.mapSelectedFilters(filters);
                actions.push(new fromSearchFiltersActions.RefreshFilters({
                  filters: filters,
                  keepFilteredOutOptions: false
                }));
              }
              actions.push(new fromComphubPageActions.SetSelectedJobData(jobData));
              actions.push(new fromSummaryCardActions.SetMinPaymarketMinimumWage(response.MinPaymarketMinimumWage));
              actions.push(new fromSummaryCardActions.SetMaxPaymarketMinimumWage(response.MaxPaymarketMinimumWage));
              actions.push(new fromSummaryCardActions.GetJobPricedHistorySummarySuccess());
              actions.push(new fromComphubPageActions.NavigateToCard({ cardId: ComphubPages.Summary }));

              return actions;
            }),
            catchError(error => of(new fromSummaryCardActions.GetJobPricedHistorySummaryError()))
          );
      })
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromComphubMainReducer.State>,
    private comphubApiService: ComphubApiService,
    private payfactorsSearchApiModelMapper: PayfactorsSearchApiModelMapper,
    private winRef: WindowRef
  ) {}
}
