import { Injectable } from '@angular/core';

import {Action, Store} from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import { ComphubApiService } from 'libs/data/payfactors-api/comphub';
import { ComphubType } from 'libs/constants';
import { ExchangeDataSet } from 'libs/models/comphub';

import * as fromComphubSharedReducer from '../../_shared/reducers';
import * as fromComphubSharedPageActions from '../../_shared/actions/comphub-page.actions';
import { FooterContextRequest, FooterHelper } from '../../_shared/models';

import * as fromPeerTrendsDataReducers from '../reducers';
import * as fromPeerTrendsDataLandingCardActions from '../actions/trends-landing-card.actions';

@Injectable()
export class ComphubPageOverridesEffects {

  @Effect()
  updateFooterContext$ = this.actions$
    .pipe(
      ofType(fromComphubSharedPageActions.UPDATE_FOOTER_CONTEXT),
      withLatestFrom(
        this.store.select(fromComphubSharedReducer.getSelectedPageId),
        this.store.select(fromComphubSharedReducer.getJobPricingBlocked),
        this.store.select(fromComphubSharedReducer.getSelectedJob),
        this.store.select(fromComphubSharedReducer.getWorkflowContext),
        this.store.select(fromComphubSharedReducer.getSelectedJobData),
        this.store.select(fromComphubSharedReducer.getShowJobPricedHistorySummary),
        this.store.select(fromComphubSharedReducer.getSmbLimitReached),
        this.store.select(fromPeerTrendsDataReducers.getSelectedTrendId),
        (action, selectedPageId, jobPricingBlocked, selectedJob, workflowContext, selectedJobData, showJobPricedHistorySummary, smbLimitReached,
         selectedTrendId) =>
          ({ action, selectedPageId, jobPricingBlocked, selectedJob, workflowContext, selectedJobData, showJobPricedHistorySummary, smbLimitReached,
            selectedTrendId })
      ),
      map((data) => {
        const footerContextRequest: FooterContextRequest = {
          PageId: data.selectedPageId,
          JobPricingBlocked: data.jobPricingBlocked,
          JobSelected: !!data.selectedJob,
          JobDataSelected: !!data.selectedJobData,
          IsPeerComphubType: data.workflowContext.comphubType === ComphubType.PEER,
          ShowJobPricedHistorySummary: data.showJobPricedHistorySummary,
          SmbLimitReached: data.smbLimitReached,
          SelectedTrendId: data.selectedTrendId
        };
        // TODO: [JP] We can probably define our own footer context here now.
        const footerContext = FooterHelper.getFooterContext(footerContextRequest);
        return new fromComphubSharedPageActions.SetFooterContext(footerContext);
      })
    );

  @Effect()
  getExchangeDataSets$ = this.actions$
    .pipe(
      ofType(fromComphubSharedPageActions.GET_EXCHANGE_DATA_SETS),
      switchMap(() => {
        return this.comphubApiService.getUnrestrictedExchangeDataSets()
          .pipe(
            mergeMap((response) => {
              const actions: Action[] = [new fromComphubSharedPageActions.GetExchangeDataSetsSuccess(response)];
              const activeExchange = response.filter(x => x.Active)[0];
              if (!!activeExchange) {
                actions.push(new fromPeerTrendsDataLandingCardActions.GetNewExchangeParticipants(activeExchange.ExchangeId));
                actions.push(new fromPeerTrendsDataLandingCardActions.GetOrgIncCountHistory(activeExchange.ExchangeId));
              }

              return actions;
            })
          );
      })
    );

  @Effect()
  updateActiveDataset$ = this.actions$
    .pipe(
      ofType(fromComphubSharedPageActions.UPDATE_ACTIVE_EXCHANGE_DATA_SET),
      withLatestFrom(
        this.store.select(fromComphubSharedReducer.getActiveExchangeDataSet),
        (action: fromComphubSharedPageActions.UpdateActiveExchangeDataSet, exchange: ExchangeDataSet) => ({action, exchange})
      ),
      mergeMap((data) => {
        return [
          new fromPeerTrendsDataLandingCardActions.GetNewExchangeParticipants(data.exchange.ExchangeId),
          new fromPeerTrendsDataLandingCardActions.GetOrgIncCountHistory(data.exchange.ExchangeId)
        ];
      })
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromComphubSharedReducer.State>,
    private comphubApiService: ComphubApiService
  ) {}
}
