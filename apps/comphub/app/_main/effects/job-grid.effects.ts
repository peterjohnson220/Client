import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

import { ComphubApiService } from 'libs/data/payfactors-api';

import * as fromComphubMainReducer from '../reducers';
import * as fromComphubPageActions from '../actions/comphub-page.actions';
import * as fromJobGridActions from '../actions/job-grid.actions';
import * as fromSummaryCardActions from '../actions/summary-card.actions';
import { DataCardHelper, PayfactorsApiModelMapper } from '../helpers';
import { ExchangeExplorerContextService } from 'libs/features/peer/exchange-explorer/services';
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
        this.store.select(fromComphubMainReducer.getWorkflowContext),
        (action, exchangeExplorerFilterContext, workflowContext) =>
          ({action, exchangeExplorerFilterContext, workflowContext})
      ),
      switchMap((data) => {
        return this.comphubApiService.getPeerQuickPriceData(data.exchangeExplorerFilterContext)
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
              if (data.workflowContext.selectedPageId === ComphubPages.Jobs) {
                actions.push(new fromComphubPageActions.AddAccessiblePages([ComphubPages.Markets]));
              }
              return actions;
            }),
            catchError(() => of(new fromJobGridActions.GetQuickPriceMarketDataError()))
          );
      })
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromComphubMainReducer.State>,
    private comphubApiService: ComphubApiService,
    private exchangeExplorerContextService: ExchangeExplorerContextService
  ) {}
}
