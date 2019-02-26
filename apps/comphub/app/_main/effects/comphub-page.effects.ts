import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { map, mergeMap, switchMap, withLatestFrom, tap } from 'rxjs/operators';

import * as fromRootState from 'libs/state/state';
import { CompanySettingsEnum } from 'libs/models/company';
import { ComphubApiService } from 'libs/data/payfactors-api/comphub';

import * as fromMarketsCardActions from '../actions/markets-card.actions';
import * as fromDataCardActions from '../actions/data-card.actions';
import * as fromComphubPageActions from '../actions/comphub-page.actions';
import * as fromComphubMainReducer from '../reducers';
import { SmbClientHelper } from '../helpers';
import {HttpErrorResponse} from '@angular/common/http';

@Injectable()
export class ComphubPageEffects {

  @Effect()
  initComphubPage$ = this.actions$
  .ofType(fromComphubPageActions.INIT)
  .pipe(
    withLatestFrom(
      this.store.select(fromRootState.getUserContext),
      this.store.select(fromRootState.getCompanySettings),
      (action, userContext, companySettings) =>
        ({ action, userContext, companySettings })
    ),
    mergeMap((data) => {
      const actions = [];
      const isSmallBizClient = SmbClientHelper.isSmallBuisnessClient(data.userContext);
      const hasNotYetAcceptedPeerTC = data.companySettings.some(s =>
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
    .ofType(fromComphubPageActions.GET_JOB_PRICING_LIMIT_INFO)
    .pipe(
      switchMap(() =>
        this.comphubApiService.getJobPricingLimitInfo()
          .pipe(
            map((response) => new fromComphubPageActions.SetJobPricingLimitInfo(response))
          )
      )
    );

  @Effect()
  onNavigation$ = this.actions$
    .ofType(
      fromComphubPageActions.NAVIGATE_TO_CARD,
      fromComphubPageActions.NAVIGATE_TO_NEXT_CARD,
      fromComphubPageActions.NAVIGATE_TO_PREVIOUS_CARD)
    .pipe(
      withLatestFrom(
        this.store.select(fromComphubMainReducer.getPaymarketsFilter),
        this.store.select(fromComphubMainReducer.getSelectedPaymarket),
        (action, payMarketsFilter, selectedPayMarket) => ({ payMarketsFilter, selectedPayMarket })
      ),
      mergeMap((data) => {
        const actions = [];
        if (data.payMarketsFilter) {
          actions.push(new fromMarketsCardActions.SetPaymarketFilter(''));
        }
        if (data.selectedPayMarket) {
          actions.push(new fromMarketsCardActions.OrderPayMarketsWithSelectedFirst());
        }

        return actions;
      })
    );

  @Effect({ dispatch: false })
  handleApiError$ = this.actions$
    .ofType(fromComphubPageActions.HANDLE_API_ERROR).pipe(
      tap((action: fromComphubPageActions.HandleApiError) =>
        this.redirectForUnauthorized(action.payload)
      )
    );

  private redirectForUnauthorized(error: HttpErrorResponse) {
    if (error.status === 401) {
      const redirectToAfterSuccessfulLogin = window.location.pathname + window.location.search;
      window.location.href = '/?' + encodeURIComponent(redirectToAfterSuccessfulLogin);
    }
  }

  constructor(
    private actions$: Actions,
    private store: Store<fromComphubMainReducer.State>,
    private comphubApiService: ComphubApiService,
  ) {}
}
