import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

import { ComphubApiService } from 'libs/data/payfactors-api';
import { ExchangeExplorerContextService } from 'libs/features/peer/exchange-explorer/services';
import { QuickPriceExchangeDataSearchRequest } from 'libs/models/payfactors-api/peer/exchange-data-search';
import * as fromExchangeExplorerActions from 'libs/features/peer/exchange-explorer/actions/exchange-filter-context.actions';

import * as fromComphubMainReducer from '../reducers';
import * as fromComphubPageActions from '../actions/comphub-page.actions';
import * as fromJobGridActions from '../actions/job-grid.actions';
import * as fromSummaryCardActions from '../actions/summary-card.actions';
import { DataCardHelper, PayfactorsApiModelMapper } from '../helpers';
import { ComphubPages } from '../data';
import { JobGridData } from '../models';

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
        (action, workflowContext) => ({ action, workflowContext })
      ),
      map((data) => {
        if (data.workflowContext.selectedPageId === ComphubPages.Jobs) {
          return new fromJobGridActions.GetPeerJobData();
        } else {
          return { type: 'No Action' };
        }
      })
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromComphubMainReducer.State>,
    private comphubApiService: ComphubApiService,
    private exchangeExplorerContextService: ExchangeExplorerContextService
  ) {}
}
