import { Injectable } from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';

import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, mergeMap, switchMap, withLatestFrom, tap, combineLatest } from 'rxjs/operators';

import * as fromRootState from 'libs/state/state';
import { CompanySettingsEnum } from 'libs/models/company';
import { ComphubApiService } from 'libs/data/payfactors-api/comphub';

import * as fromMarketsCardActions from '../actions/markets-card.actions';
import * as fromDataCardActions from '../actions/data-card.actions';
import * as fromComphubPageActions from '../actions/comphub-page.actions';
import * as fromJobsCardActions from '../actions/jobs-card.actions';
import * as fromComphubMainReducer from '../reducers';
import { PayfactorsApiModelMapper, SmbClientHelper } from '../helpers';
import { ComphubPages } from '../data';

@Injectable()
export class ComphubPageEffects {

  @Effect()
  initComphubPage$ = this.actions$
  .pipe(
    ofType(fromComphubPageActions.INIT),
    combineLatest(
      this.store.select(fromRootState.getUserContext),
      this.store.select(fromRootState.getCompanySettings),
      (action, userContext, companySettings) =>
        ({ action, userContext, companySettings })
    ),
    mergeMap((data) => {
      const actions = [];
      const isSmallBizClient = data.userContext && SmbClientHelper.isSmallBuisnessClient(data.userContext);
      const hasNotYetAcceptedPeerTC = data.companySettings && data.companySettings.some(s =>
        s.Key === CompanySettingsEnum.PeerTermsAndConditionsAccepted &&
        s.Value === 'false');

      if (isSmallBizClient || hasNotYetAcceptedPeerTC) {
        actions.push(new fromDataCardActions.ShowPeerBanner());
      }

      if (isSmallBizClient) {
        actions.push(new fromComphubPageActions.GetJobPricingLimitInfo());
      }

      return actions;
    })
  );

  @Effect()
  getJobPricingLimitInfo$ = this.actions$
    .pipe(
      ofType(fromComphubPageActions.GET_JOB_PRICING_LIMIT_INFO),
      switchMap(() =>
        this.comphubApiService.getJobPricingLimitInfo()
          .pipe(
            map((response) => new fromComphubPageActions.SetJobPricingLimitInfo(response))
          )
      )
    );

  @Effect()
  onNavigation$ = this.actions$
    .pipe(
      ofType(
        fromComphubPageActions.NAVIGATE_TO_CARD,
        fromComphubPageActions.NAVIGATE_TO_NEXT_CARD,
        fromComphubPageActions.NAVIGATE_TO_PREVIOUS_CARD),
      withLatestFrom(
        this.store.select(fromComphubMainReducer.getSelectedPageId),
        this.store.select(fromComphubMainReducer.getPaymarketsFilter),
        this.store.select(fromComphubMainReducer.getSelectedPaymarket),
        (action, selectedPageId, payMarketsFilter, selectedPayMarket) =>
          ({ selectedPageId, payMarketsFilter, selectedPayMarket })
      ),
      mergeMap((data) => {
        const actions = [];

        if (data.selectedPageId === ComphubPages.Markets) {
          if (data.payMarketsFilter) {
            actions.push(new fromMarketsCardActions.SetPaymarketFilter(''));
          }
          if (data.selectedPayMarket) {
            actions.push(new fromMarketsCardActions.OrderPayMarketsWithSelectedFirst());
          }
        }

        return actions;
      })
    );

  @Effect({ dispatch: false })
  handleApiError$ = this.actions$
    .pipe(
      ofType(fromComphubPageActions.HANDLE_API_ERROR),
      tap((action: fromComphubPageActions.HandleApiError) =>
        this.redirectForUnauthorized(action.payload)
      )
    );

  @Effect()
  getCountryDataSets$ = this.actions$
    .pipe(
      ofType(fromComphubPageActions.GET_COUNTRY_DATA_SETS),
      switchMap(() => {
        return this.comphubApiService.getCountryDataSets()
          .pipe(
            mergeMap((response) => {
              const actions = [];
              actions.push(new fromComphubPageActions.GetCountryDataSetsSuccess(
                PayfactorsApiModelMapper.mapCountryDataSetResponseToCountryDataSets(response)));

              if (response.length) {
                actions.push(new fromMarketsCardActions.InitMarketsCard());
                actions.push(new fromJobsCardActions.GetTrendingJobs());
              }
              return actions;
            })
          );
      })
    );
  @Effect()
  getExchangeDataSets$ = this.actions$
    .pipe(
      ofType(fromComphubPageActions.GET_EXCHANGE_DATA_SETS),
      switchMap(() => {
        return this.comphubApiService.getExchangeDataSets()
          .pipe(
            mergeMap((response) => {
              const actions = [];
              actions.push(new fromComphubPageActions.GetExchangeDataSetsSuccess(
                response));

              if (response.length) {
                actions.push(new fromMarketsCardActions.InitMarketsCard());
                actions.push(new fromJobsCardActions.GetTrendingJobs());
              }
              return actions;
            })
          );
      })
    );
  @Effect()
  updateActiveCountryDataSet$ = this.actions$
    .pipe(
      ofType(fromComphubPageActions.UPDATE_ACTIVE_COUNTRY_DATA_SET),
      mergeMap(() => [
        new fromJobsCardActions.GetTrendingJobs(),
        new fromDataCardActions.ClearSelectedJobData(),
        new fromComphubPageActions.ResetAccessiblePages(),
        new fromComphubPageActions.ResetPagesAccessed(),
        new fromJobsCardActions.ClearSelectedJob(),
        new fromMarketsCardActions.SetToDefaultPaymarket(),
        new fromMarketsCardActions.InitMarketsCard(),
        new fromJobsCardActions.ClearJobSearchOptions(),
        new fromJobsCardActions.PersistActiveCountryDataSet()
      ])
    );

  private redirectForUnauthorized(error: HttpErrorResponse) {
    if (error.status === 401) {
      const redirectToAfterSuccessfulLogin = window.location.pathname + window.location.search;
      window.location.href = '/?redirect=' + encodeURIComponent(redirectToAfterSuccessfulLogin);
    }
  }

  constructor(
    private actions$: Actions,
    private store: Store<fromComphubMainReducer.State>,
    private comphubApiService: ComphubApiService,
  ) {}
}
