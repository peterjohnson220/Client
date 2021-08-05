import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

import { ComphubApiService } from 'libs/data/payfactors-api';
import { ExchangeExplorerContextService } from 'libs/features/peer/exchange-explorer/services';
import { QuickPriceExchangeDataSearchRequest } from 'libs/models/payfactors-api/peer/exchange-data-search';
import * as fromExchangeExplorerActions from 'libs/features/peer/exchange-explorer/actions/exchange-filter-context.actions';
import { JobGridData } from 'libs/models/comphub';

import * as fromComphubMainReducer from '../reducers';
import * as fromComphubPageActions from '../actions/comphub-page.actions';
import * as fromJobGridActions from '../actions/job-grid.actions';
import * as fromSummaryCardActions from '../actions/summary-card.actions';
import { DataCardHelper, PayfactorsApiModelMapper } from '../helpers';
import { ComphubPages } from '../data';
import { WorkflowContext } from '../models';

@Injectable()
export class JobGridEffects {

  @Effect()
  getQuickPriceMarketData$ = this.actions$
    .pipe(
      ofType(fromJobGridActions.GET_QUICK_PRICE_MARKET_DATA),
      withLatestFrom(
        this.store.select(fromComphubMainReducer.getActiveCountryDataSet),
        (action: fromJobGridActions.GetQuickPriceMarketData, dataSet) => ({ action, dataSet })
      ),
      switchMap((data) => {
          return this.comphubApiService.getQuickPriceData({
            JobTitleShort: data.action.payload.JobTitleShort,
            CompanyPaymarketId: data.action.payload.CompanyPayMarketId,
            PagingOptions: {
              Count: data.action.payload.Take,
              From: data.action.payload.Skip
            },
            Sort: DataCardHelper.getSortOption(data.action.payload),
            CountryCode: data.dataSet.CountryCode
          })
            .pipe(
              mergeMap((response) => {
                const gridDataResult = PayfactorsApiModelMapper.mapPriceDataToGridDataResult(response);
                const actions = [];
                if (data.action.payload.Skip === 0) {
                  actions.push(new fromJobGridActions.GetQuickPriceDataSuccess(gridDataResult));
                } else {
                  actions.push(new fromJobGridActions.LoadMoreDataSuccess(gridDataResult.Data));
                }
                actions.push(new fromSummaryCardActions.SetMinPaymarketMinimumWage(response.MinPaymarketMinimumWage));
                actions.push(new fromSummaryCardActions.SetMaxPaymarketMinimumWage(response.MaxPaymarketMinimumWage));

                return actions;
              }),
              catchError((error) => of(new fromJobGridActions.GetQuickPriceMarketDataError(),
                new fromComphubPageActions.HandleApiError(error)))
            );
        }
      ));

  @Effect()
  loadPeerJobData$ = this.actions$
    .pipe(
      ofType(fromJobGridActions.GET_PEER_JOB_DATA),
      withLatestFrom(
        this.exchangeExplorerContextService.selectFilterContext(),
        (action, exchangeExplorerFilterContext) =>
          ({action, exchangeExplorerFilterContext})
      ),
      switchMap((data) => {
        const request: QuickPriceExchangeDataSearchRequest = {
          ...data.exchangeExplorerFilterContext,
          ViewOnly: true
        };
        return this.comphubApiService.getPeerQuickPriceData(request)
          .pipe(
            mergeMap((response) => {
              const result = response.JobData;
              result.ShowJd = true;
              const jobGridData: JobGridData = {
                Data: [result],
                Total: 1
              };
              const actions = [];
              actions.push(new fromJobGridActions.GetQuickPriceDataSuccess(jobGridData));
              actions.push(new fromComphubPageActions.SetSelectedJobData(result));
              actions.push(new fromComphubPageActions.AddAccessiblePages([ComphubPages.Markets]));
              return actions;
            }),
            catchError(() => of(new fromJobGridActions.GetQuickPriceMarketDataError()))
          );
      })
    );

  @Effect()
  setFilterContext$ = this.actions$
    .pipe(
      ofType(fromExchangeExplorerActions.SET_FILTER_CONTEXT),
      withLatestFrom(
        this.store.select(fromComphubMainReducer.getWorkflowContext),
        this.store.select(fromComphubMainReducer.getIsQuickPriceHistoryOpen),
        (action, workflowContext, isFromJobHistory) => ({ action, workflowContext, isFromJobHistory })
      ),
      map((data) => {
        if (data.workflowContext.selectedPageId === ComphubPages.Jobs && !data.isFromJobHistory) {
          return new fromJobGridActions.GetPeerJobData();
        } else {
          return { type: 'No Action' };
        }
      })
    );

  @Effect()
  searchCrowdSourcedJobsByTitle$ = this.actions$
    .pipe(
      ofType(fromJobGridActions.SEARCH_CROWD_SOURCED_JOBS_BY_TITLE),
      withLatestFrom(
        (action: fromJobGridActions.SearchCrowdSourcedJobsByTitle) => ({action})
      ),
      switchMap((data) => {
          return this.comphubApiService.searchCrowdSourcedJobs(data.action.payload)
            .pipe(
              mergeMap(response => {
                const actions = [];
                const jobGridData = PayfactorsApiModelMapper.mapSearchCrowdSourcedJobsResponseToJobGridData(response);
                actions.push(new fromJobGridActions.SearchCrowdSourcedJobsByTitleSuccess(jobGridData));

                return actions;
              }),
              catchError((error) => of(
                new fromJobGridActions.SearchCrowdSourcedJobsByTitleError(),
                new fromComphubPageActions.HandleApiError(error)))
            );
        }
      ));

  @Effect()
  searchCrowdSourcedJobsByTitleSuccess$ = this.actions$
    .pipe(
      ofType<fromJobGridActions.SearchCrowdSourcedJobsByTitleSuccess>(fromJobGridActions.SEARCH_CROWD_SOURCED_JOBS_BY_TITLE_SUCCESS),
      withLatestFrom(
        this.store.select(fromComphubMainReducer.getWorkflowContext),
        (action, workflowContext: WorkflowContext) => ({ action, workflowContext })
      ),
      mergeMap((data) => {
        const actions = [];
        data.action.payload.Data.forEach((job) => {
          actions.push(new fromJobGridActions.GetCrowdSourcedJobPricing({
            jobTitle: job.JobTitle,
            country: data.workflowContext.activeCountryDataSet.CountryName,
            paymarketId: null
          }));
        });

        return actions;
      })
    );

  @Effect()
  getCrowdSourcedJobPricing$ = this.actions$
    .pipe(
      ofType(fromJobGridActions.GET_CROWD_SOURCED_JOB_PRICING),
      withLatestFrom(
        (action: fromJobGridActions.GetCrowdSourcedJobPricing) => ({action})
      ),
      mergeMap((data) => {
          return this.comphubApiService.getCrowdSourcedJobPricing(data.action.payload.jobTitle, data.action.payload.country, data.action.payload.paymarketId)
            .pipe(
              map(response => {
                const jobData = PayfactorsApiModelMapper.mapGetCrowdSourcedJobPricingResponseToJobData(response);
                return new fromJobGridActions.GetCrowdSourcedJobPricingSuccess(jobData);
              }),
              catchError((error) => of(
                new fromJobGridActions.GetCrowdSourcedJobPricingError(),
                new fromComphubPageActions.HandleApiError(error)))
            );
        }
      ));

  constructor(
    private actions$: Actions,
    private store: Store<fromComphubMainReducer.State>,
    private comphubApiService: ComphubApiService,
    private exchangeExplorerContextService: ExchangeExplorerContextService
  ) {}
}
