import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

import { ComphubApiService } from 'libs/data/payfactors-api/comphub';
import { SortOption } from 'libs/models/payfactors-api/comphub/request';
import * as fromRootReducer from 'libs/state/state';
import { UserContext } from 'libs/models/security';
import { SystemUserGroupNames } from 'libs/constants';

import * as fromJobsCardActions from '../actions/jobs-card.actions';
import * as fromMarketsCardActions from '../actions/markets-card.actions';
import * as fromDataCardActions from '../actions/data-card.actions';
import * as fromComphubPageActions from '../actions/comphub-page.actions';
import * as fromComphubReducer from '../reducers';
import { PayfactorsApiModelMapper } from '../helpers';
import { JobData, QuickPriceGridContext } from '../models';
import { ComphubPages } from '../data';

@Injectable()
export class DataCardEffects {


  @Effect()
  cardOpened$ = this.actions$
    .ofType(fromDataCardActions.CARD_OPENED)
    .pipe(
      withLatestFrom(
        this.store.select(fromRootReducer.getUserContext),
        this.store.select(fromComphubReducer.getSelectedJob),
        this.store.select(fromComphubReducer.getPricedJobTitleHistory),
        (action, userContext, selectedJob, pricedJobTitleHistory) => ({ selectedJob, pricedJobTitleHistory, userContext })
      ),
      map((data) => new fromDataCardActions.ShouldIncrementPricedJobCount(
        this.shouldIncrementPricingLimit(data.selectedJob, data.pricedJobTitleHistory, data.userContext))
      )
    );

  @Effect()
  incrementJobPricedCount$ = this.actions$
    .ofType(fromDataCardActions.INCREMENT_PRICED_JOB_COUNT)
    .pipe(
      switchMap(() => {
        return this.comphubApiService.incrementPricedJobCount()
          .pipe(
            withLatestFrom(
              this.store.select(fromComphubReducer.getSelectedJob), (response, selectedJob) => ({ response, selectedJob })
            ),
            mergeMap((data) => [
                new fromDataCardActions.SetJobPricingLimitInfo({ Used: data.response.Used, Available: data.response.Available }),
                new fromDataCardActions.ShouldIncrementPricedJobCount(false),
                new fromDataCardActions.AddToPricedJobTitleHistory(data.selectedJob)
              ]
            )
          );
      })
    );

  @Effect()
  getQuickPriceMarketData$ = this.actions$
    .ofType(fromDataCardActions.GET_QUICK_PRICE_MARKET_DATA)
    .pipe(
      switchMap((action: fromDataCardActions.GetQuickPriceMarketData) => {
          return this.comphubApiService.getQuickPriceData({
            JobTitleShort: action.payload.JobTitleShort,
            CompanyPaymarketId: action.payload.CompanyPayMarketId,
            PagingOptions: {
              Count: action.payload.Take,
              From: action.payload.Skip
            },
            Sort: DataCardEffects.getSortOption(action.payload)
          })
            .pipe(
              withLatestFrom(
                this.store.select(fromComphubReducer.getShouldIncrementPricedJobCount),
                (response, shouldIncrement) => ({ response, shouldIncrement })
              ),
              mergeMap((data) => {
                const actions = [];
                const gridDataResult = PayfactorsApiModelMapper.mapPriceDataToGridDataResult(data.response);
                actions.push(new fromDataCardActions.GetQuickPriceMarketDataSuccess(gridDataResult));

                if (data.shouldIncrement) {
                  actions.push(new fromDataCardActions.IncrementPricedJobCount());
                }

                return actions;
              }),
              catchError(() => of(new fromDataCardActions.GetQuickPriceMarketDataError()))
            );
        }
      ));

  @Effect()
  setSelectedJobData$ = this.actions$
    .ofType(fromDataCardActions.SET_SELECTED_JOB_DATA)
    .pipe(
      map((action: fromDataCardActions.SetSelectedJobData) => action.payload),
      mergeMap((jobData: JobData) => [
        new fromComphubPageActions.UpdateCardSubtitle({ cardId: ComphubPages.Data, subTitle: `Payfactors ${jobData.JobTitle}`}),
        new fromComphubPageActions.AddAccessiblePages([ComphubPages.Summary])
      ])
    );

  @Effect()
  clearSelectedJobData$ = this.actions$
    .ofType(fromDataCardActions.CLEAR_SELECTED_JOB_DATA)
    .pipe(
      mergeMap(() => {
        return [
          new fromComphubPageActions.UpdateCardSubtitle({ cardId: ComphubPages.Data, subTitle: ''}),
          new fromComphubPageActions.RemoveAccessiblePages([ComphubPages.Summary])
        ];
      })
    );

  @Effect()
  setMarketDataChange$ = this.actions$
  .ofType(
    fromMarketsCardActions.SET_SELECTED_PAYMARKET,
    fromJobsCardActions.SET_SELECTED_JOB)
  .pipe(
    map(() => new fromDataCardActions.SetMarketDataChange(true))
  );

  private static getSortOption(gridContext: QuickPriceGridContext): SortOption {
    if (gridContext.Sort) {
      // only allowing single sort
      return {
        Dir: gridContext.Sort.dir,
        Field: gridContext.Sort.field
      };
    }
    return null;
  }

  private shouldIncrementPricingLimit(jobTitle: string, history: string[], userContext: UserContext): boolean {
    return !history.some(h => h.toLowerCase() === jobTitle.toLowerCase())
      && userContext.CompanySystemUserGroupsGroupName === SystemUserGroupNames.SmallBusiness;
  }

  constructor(
    private actions$: Actions,
    private store: Store<fromComphubReducer.State>,
    private comphubApiService: ComphubApiService,
  ) {
  }
}
