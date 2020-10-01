import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import {switchMap, catchError, mergeMap, withLatestFrom, map} from 'rxjs/operators';

import { Actions, Effect, ofType } from '@ngrx/effects';
import {Action, Store} from '@ngrx/store';

import {JobsApiService, PricingApiService} from 'libs/data/payfactors-api/index';
import { staticFilters } from '../../survey-search/data';
import { PayfactorsApiModelMapper } from '../helpers';

import { SearchFilterMappingDataObj } from '../../search/models';
import { SurveySearchFiltersHelper } from '../../survey-search/helpers';

import * as fromModifyPricingsActions from '../actions/modify-pricings.actions';
import * as fromContextActions from '../../survey-search/actions/context.actions';
import * as fromSearchFiltersActions from '../../search/actions/search-filters.actions';
import * as fromJobsToPriceActions from '../actions/jobs-to-price.actions';
import * as fromSurveySearchFiltersActions from '../../survey-search/actions/survey-search-filters.actions';
import * as fromMultiMatchReducer from '../reducers';

import {SurveySearchResultDataSources} from '../../../constants';
import * as fromMultiMatchPageActions from '../actions/multi-match-page.actions';

@Injectable()
export class ModifyPricingsEffects {
  constructor(
    private action$: Actions,
    private store: Store<fromMultiMatchReducer.State>,
    private jobsApiService: JobsApiService,
    private pricingApiService: PricingApiService,
private searchFilterMappingDataObj: SearchFilterMappingDataObj
  ) {}

  @Effect()
  modifyPricings$: Observable<Action> = this.action$.pipe(
    ofType(fromModifyPricingsActions.GET_PRICINGS_TO_MODIFY),
    switchMap((action: any) => {
      return this.jobsApiService.getPricingsToModify(action.payload.Pricings).pipe(
        mergeMap(response => {
          const actions = [];
          actions.push(new fromContextActions.SetModifyPricingsSearchContext(response.Context));
          if (action.payload.RestrictSearchToPayMarketCountry) {
            actions.push(new fromSearchFiltersActions.AddFilters([
              SurveySearchFiltersHelper.buildLockedCountryCodeFilter(response.Context.CountryCode, this.searchFilterMappingDataObj)
            ]));
          }
          actions.push(new fromSurveySearchFiltersActions.GetDefaultScopesFilter());
          actions.push(new fromSearchFiltersActions.AddFilters(staticFilters));
          actions.push(new fromJobsToPriceActions.GetJobsToPriceSuccess(
            PayfactorsApiModelMapper.mapMatchedSurveyJobToJobsToPrice(response.PricingsToModify)));
          actions.push(new fromModifyPricingsActions.GetPricingsToModifySuccess());
          return actions;
        }),
        catchError(error => of(new fromModifyPricingsActions.GetPricingsToModifyError()))
      );
    })
  );

  @Effect()
  savePricings$: Observable<Action> = this.action$.pipe(
    ofType(fromModifyPricingsActions.MODIFY_PRICINGS),
    withLatestFrom(
      this.store.select(fromMultiMatchReducer.getJobsToPrice),
      (action, jobsToPrice) =>
        ({ jobsToPrice })
    ),
    switchMap( (action: any) => {
      const modifyPricingMatchesRequest = action.jobsToPrice.filter(f => (!!f.DataCutsToAdd && f.DataCutsToAdd.length)
        || (!!f.DeletedJobMatchCutIds && f.DeletedJobMatchCutIds.length)).map(s =>  {
          return {
            PricingId: s.Id,
            JobId: s.CompanyJobId,
            PaymarketId: s.PaymarketId,
            MatchesToDeleted: (s.DeletedJobMatchCutIds || []),
            SurveyCutMatchesToAdded: (s.DataCutsToAdd || [])
              .filter(f => f.DataSource === SurveySearchResultDataSources.Surveys).map( m => m.ServerInfo.SurveyDataId),
            PayfactorsCutMatchesToAdded: (s.DataCutsToAdd || [])
              .filter(f => f.DataSource === SurveySearchResultDataSources.Payfactors).map( m => m.SurveyJobCode),
            PeerCutMatchesToAdded: (s.DataCutsToAdd || [])
              .filter(f => f.DataSource === SurveySearchResultDataSources.Peer).map( m => ({
                  ExchangeId: m.Job?.PeerJobInfo?.ExchangeId,
                  ExchangeJobId: m.Job?.PeerJobInfo?.ExchangeJobId,
                  DailyNatAvgId: m.ServerInfo?.DailyNatAvgId,
                  DailyScopeAvgId: m.ServerInfo?.DailyScopeAvgId
              }))
          };
        });
      return this.pricingApiService.savePricingMatches(modifyPricingMatchesRequest).pipe(
        map(() =>  new fromModifyPricingsActions.ModifyPricingSuccess()),
        catchError(error => of(new fromModifyPricingsActions.ModifyPricingsError()))
      );
    })
  );
}
