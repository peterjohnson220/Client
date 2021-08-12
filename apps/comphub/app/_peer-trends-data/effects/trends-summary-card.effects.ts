import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

import { ExchangeExplorerContextService } from 'libs/features/peer/exchange-explorer/services';
import { ExchangeDataSearchApiService } from 'libs/data/payfactors-api/search/peer';
import { CalendarInterval, HistoricalExchangeDataSearchRequest } from 'libs/models/payfactors-api/peer/exchange-data-search/request';
import { UpsertPeerTrendRequest } from 'libs/models/peer/requests';
import { PeerTrendsApiService } from 'libs/data/payfactors-api/peer/peer-trends-api.service';

import * as fromComphubPeerTrendsDataReducers from '../reducers';
import * as fromTrendsSummaryCardActions from '../actions/trends-summary-card.actions';

@Injectable()
export class TrendsSummaryCardEffects {
  constructor(
    private actions$: Actions,
    private store: Store<fromComphubPeerTrendsDataReducers.State>,
    private exchangeExplorerContextService: ExchangeExplorerContextService,
    private exchangeDataSearchApiService: ExchangeDataSearchApiService,
    private peerTrendApiService: PeerTrendsApiService
  ) {}

  @Effect({dispatch: true})
  getPeerTrends$ = this.actions$.pipe(
    ofType(fromTrendsSummaryCardActions.GET_PEER_TRENDS),
    map((action: fromTrendsSummaryCardActions.GetPeerTrends) => action),
    withLatestFrom(
      this.exchangeExplorerContextService.selectFilterContext(),
      this.store.select(fromComphubPeerTrendsDataReducers.getSelectedExchangeJobs),
      this.store.select(fromComphubPeerTrendsDataReducers.getSelectedTrendId),
      (action, exchangeExplorerFilterContext, exchangeJobs, trendId) => ({action, exchangeExplorerFilterContext, exchangeJobs, trendId})
    ),
    switchMap( (data) => {
      const lowerDate = new Date();
      lowerDate.setFullYear(lowerDate.getFullYear() - 3);

      const request: HistoricalExchangeDataSearchRequest = {
        ...data.exchangeExplorerFilterContext,
        From: lowerDate,
        To: new Date(),
        CalendarInterval: CalendarInterval.Month,
        PeerTrendId: data.trendId
      };

      return this.exchangeDataSearchApiService.getHistoricalTrends(request).pipe(
        mergeMap((response) => {

          if (response.PricingHistoryCollection.length > 0) {
            const upperPayRateDate = response.PricingHistoryCollection[response.PricingHistoryCollection.length - 1];
            const lowerPayRateDate = response.PricingHistoryCollection[0];
            const basePayPctChange = (upperPayRateDate.BasePay - lowerPayRateDate.BasePay) / lowerPayRateDate.BasePay;
            const incsPctChange = (upperPayRateDate.Incs - lowerPayRateDate.Incs) / lowerPayRateDate.Incs;
            const contributingCompanyCount = upperPayRateDate.Orgs;

            const contributingCompanyJobCount = upperPayRateDate.CompanyJobCount;
            const contributingExchangeJobCount = upperPayRateDate.ExchangeJobCount;

            return [
              new fromTrendsSummaryCardActions.SetTrendsSummaryDetails({
                BasePayPctChange: basePayPctChange,
                IncsPctChange: incsPctChange,
                ContributingCompanyJobCount: contributingCompanyJobCount,
                ContributingExchangeJobCount: contributingExchangeJobCount,
                ContributingCompanyCount: contributingCompanyCount
              }),
              new fromTrendsSummaryCardActions.GetPeerTrendsSuccess({
                PricingHistory: response.PricingHistoryCollection,
                ExchangeJobIds: response.ExchangeJobIds,
                CompanyJobIds: response.CompanyJobIds,
                SmartCodeMaps: response.SmartCodeMaps
              }),
            ];
          } else {
            return [
              new fromTrendsSummaryCardActions.SetTrendsSummaryDetails({
                BasePayPctChange: null,
                IncsPctChange: null,
                ContributingCompanyJobCount: null,
                ContributingExchangeJobCount: null,
                ContributingCompanyCount: null
              }),
              new fromTrendsSummaryCardActions.GetPeerTrendsSuccess({
                PricingHistory: response.PricingHistoryCollection,
                ExchangeJobIds: response.ExchangeJobIds,
                CompanyJobIds: response.CompanyJobIds,
                SmartCodeMaps: response.SmartCodeMaps
              })
            ];
          }

        }),
        catchError(() => of(new fromTrendsSummaryCardActions.GetPeerTrendsError()))
      );
    }));

  @Effect({dispatch: true})
  savePeerTrend$ = this.actions$.pipe(
    ofType(fromTrendsSummaryCardActions.SAVE_PEER_TREND),
    map((action: fromTrendsSummaryCardActions.SavePeerTrend) => action),
    withLatestFrom(
      this.exchangeExplorerContextService.selectFilterContext(),
      (action, exchangeExplorerFilterContext) => ({action, exchangeExplorerFilterContext})
    ),
    switchMap((data) => {
      const actions = [];
      const request: UpsertPeerTrendRequest = {
        PeerTrendDetails: data.action.payload,
        ExchangeDataSearchRequest: data.exchangeExplorerFilterContext
      };
      return this.peerTrendApiService.upsertPeerTrend(request).pipe(
        switchMap((response) => {
          actions.push(new fromTrendsSummaryCardActions.SavePeerTrendSuccess());
          actions.push(new fromTrendsSummaryCardActions.ToggleSaveTrendModal({displayModal: false}));
          return actions;
        }),
        catchError( () => of(new fromTrendsSummaryCardActions.SavePeerTrendError()))
      );
    })
  );

  @Effect({dispatch: true})
  exportExchangeJobs$ = this.actions$
    .pipe(
      ofType(fromTrendsSummaryCardActions.EXPORT_EXCHANGE_JOBS),
      withLatestFrom(
        this.store.select(fromComphubPeerTrendsDataReducers.getExchangeJobIds),
        (action, exchangeJobIds) => ({action, exchangeJobIds})
      ),
      switchMap((data) => {
        return this.exchangeDataSearchApiService.exportExchangeJobs(data.exchangeJobIds).pipe(
          map(() => {
            return new fromTrendsSummaryCardActions.ExportExchangeJobsSuccess();
          }),
          catchError( () => of(new fromTrendsSummaryCardActions.ExportExchangeJobsError()))
        );
      })
    );

  @Effect({dispatch: true})
  exportCompanyJobs$ = this.actions$
    .pipe(
      ofType(fromTrendsSummaryCardActions.EXPORT_COMPANY_JOBS),
      withLatestFrom(
        this.store.select(fromComphubPeerTrendsDataReducers.getCompanyJobIds),
        (action, companyJobIds) => ({action, companyJobIds})
      ),
      switchMap((data) => {
        return this.exchangeDataSearchApiService.exportCompanyJobs(data.companyJobIds).pipe(
          map(() => {
            return new fromTrendsSummaryCardActions.ExportCompanyJobsSuccess();
          }),
          catchError( () => of(new fromTrendsSummaryCardActions.ExportCompanyJobsError()))
        );
      })
    );
}
