import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import {Action, Store} from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, mergeMap, switchMap, withLatestFrom, tap } from 'rxjs/operators';

import * as fromRootState from 'libs/state/state';
import { CompanySettingsEnum } from 'libs/models/company';
import { ComphubApiService } from 'libs/data/payfactors-api/comphub';
import { QuickPriceType } from 'libs/constants';


import * as fromMarketsCardActions from '../actions/markets-card.actions';
import * as fromDataCardActions from '../actions/data-card.actions';
import * as fromComphubPageActions from '../actions/comphub-page.actions';
import * as fromJobsCardActions from '../actions/jobs-card.actions';
import * as fromComphubMainReducer from '../reducers';

import { PayfactorsApiModelMapper, SmbClientHelper } from '../helpers';
import { ComphubPages } from '../data';
import { FooterContextRequest, FooterHelper } from '../models';

@Injectable()
export class ComphubPageEffects {

  @Effect()
  initComphubPage$ = this.actions$
    .pipe(
      ofType(fromComphubPageActions.INIT),
      withLatestFrom(
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

        actions.push(new fromComphubPageActions.UpdateFooterContext());

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
        this.store.select(fromComphubMainReducer.getJobPricingBlocked),
        this.store.select(fromComphubMainReducer.getSelectedJob),
        this.store.select(fromComphubMainReducer.getWorkflowContext),
        (action, selectedPageId, payMarketsFilter, selectedPayMarket, jobPricingBlocked, selectedJob, workflowContext) =>
          ({ selectedPageId, payMarketsFilter, selectedPayMarket, jobPricingBlocked, selectedJob, workflowContext })
      ),
      mergeMap((data) => {
        const actions = [];

        actions.push(new fromComphubPageActions.UpdateFooterContext());

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
  updateFooterContext$ = this.actions$
    .pipe(
      ofType(fromComphubPageActions.UPDATE_FOOTER_CONTEXT),
      withLatestFrom(
        this.store.select(fromComphubMainReducer.getSelectedPageId),
        this.store.select(fromComphubMainReducer.getJobPricingBlocked),
        this.store.select(fromComphubMainReducer.getSelectedJob),
        this.store.select(fromComphubMainReducer.getWorkflowContext),
        this.store.select(fromComphubMainReducer.getSelectedJobData),
        (action, selectedPageId, jobPricingBlocked, selectedJob, workflowContext, selectedJobData) =>
          ({ action, selectedPageId, jobPricingBlocked, selectedJob, workflowContext, selectedJobData })
      ),
      map((data) => {
        const footerContextRequest: FooterContextRequest = {
          PageId: data.selectedPageId,
          JobPricingBlocked: data.jobPricingBlocked,
          JobSelected: !!data.selectedJob,
          JobDataSelected: !!data.selectedJobData,
          IsPeerQuickPriceType: data.workflowContext.quickPriceType === QuickPriceType.PEER,
        };
        const footerContext = FooterHelper.getFooterContext(footerContextRequest);
        return new fromComphubPageActions.SetFooterContext(footerContext);
      })
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
  updateActiveDataset$ = this.actions$
    .pipe(
      ofType(fromComphubPageActions.UPDATE_ACTIVE_COUNTRY_DATA_SET, fromComphubPageActions.UPDATE_ACTIVE_EXCHANGE_DATA_SET),
      map((action: fromComphubPageActions.UpdateActiveCountryDataSet|fromComphubPageActions.UpdateActiveExchangeDataSet) => action),
      mergeMap((action) => {
        const actions: Action[] = [
          new fromJobsCardActions.GetTrendingJobs(),
          new fromDataCardActions.ClearSelectedJobData(),
          new fromComphubPageActions.ResetAccessiblePages(),
          new fromComphubPageActions.ResetPagesAccessed(),
          new fromJobsCardActions.ClearSelectedJob(),
          new fromMarketsCardActions.InitMarketsCard(),
          new fromJobsCardActions.ClearJobSearchOptions()
        ];

        if (action.type === fromComphubPageActions.UPDATE_ACTIVE_COUNTRY_DATA_SET) {
          actions.push(new fromMarketsCardActions.SetToDefaultPaymarket());
          actions.push(new fromJobsCardActions.PersistActiveCountryDataSet());
        } else {
          actions.push(new fromMarketsCardActions.SetDefaultPaymarketAsSelected());
        }

        return actions;
      })
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
