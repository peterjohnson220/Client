import { Injectable } from '@angular/core';

import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { ExchangeCompanyApiService } from 'libs/data/payfactors-api/peer';
import * as fromPfDataGridActions from 'libs/features/grids/pf-data-grid/actions';
import { ExchangeExplorerContextService } from 'libs/features/peer/exchange-explorer/services';
import { ExchangeDataSearchApiService } from 'libs/data/payfactors-api/search/peer';
import { PeerTrendsApiService } from 'libs/data/payfactors-api/peer/peer-trends-api.service';
import { CalendarInterval, HistoricalExchangeDataSearchRequest } from 'libs/models/payfactors-api/peer/exchange-data-search/request';
import { ExchangeDataSearchFilterContext } from 'libs/models/peer';
import { PeerTrendResponse } from 'libs/models/payfactors-api/peer/exchange-data-filter/response';
import { PayfactorsSearchApiModelMapper } from 'libs/features/search/search/helpers';
import * as fromSearchFiltersActions from 'libs/features/search/search/actions/search-filters.actions';
import * as fromExchangeExplorerMapActions from 'libs/features/peer/exchange-explorer/actions/map.actions';

import * as fromComphubSharedReducer from '../../_shared/reducers/comphub-page.reducer';
import * as fromComphubSharedPageActions from '../../_shared/actions/comphub-page.actions';
import { ComphubPages } from '../../_shared/data';

import * as fromTrendsLandingCardActions from '../actions/trends-landing-card.actions';
import * as fromTrendsSummaryActions from '../actions/trends-summary-card.actions';
import { TrendsLandingCardConstants, PageViewIds } from '../constants';

@Injectable()
export class TrendsLandingCardEffects {
  @Effect({dispatch: true})
  getNewExchangeParticipants$ = this.actions$
    .pipe(
      ofType(fromTrendsLandingCardActions.GET_NEW_EXCHANGE_PARTICIPANTS),
      switchMap((action: fromTrendsLandingCardActions.GetNewExchangeParticipants) => {
          return this.exchangeCompanyApiService.getTopCompaniesRecentlyAddedToExchange(
            action.payload,
            TrendsLandingCardConstants.NUMBER_OF_NEW_PEER_PARTICIPANTS_TO_DISPLAY
          ).pipe(
            map( (response: string[]) => {
              return new fromTrendsLandingCardActions.GetNewExchangeParticipantsSuccess(response);
            }),
            catchError( () => of(new fromTrendsLandingCardActions.GetNewExchangeParticipantsError()))
          );
        })
    );

  @Effect({dispatch: true})
  getOrgIncCountHistory$ = this.actions$.pipe(
    ofType(fromTrendsLandingCardActions.GET_ORG_INC_COUNT_HISTORY),
    map((action: fromTrendsLandingCardActions.GetOrgIncCountHistory) => action),
    switchMap((action) => {
      const lowerDate = new Date();
      lowerDate.setFullYear(lowerDate.getFullYear() - 3);

      const filterContext = {
        ExchangeId: action.payload,
        ExchangeJobId: null,
        LockedExchangeJobId: null
      } as ExchangeDataSearchFilterContext;

      const request = {
        FilterContext: filterContext,
        From: lowerDate,
        To: new Date(),
        CalendarInterval: CalendarInterval.Month
      } as HistoricalExchangeDataSearchRequest;

      return this.exchangeDataSearchApiService.getOrgIncCountHistory(request).pipe(
        map((response) => {
          return new fromTrendsLandingCardActions.GetOrgIncCountHistorySuccess(response.OrgIncCountCollection);
        }),
        catchError(() => of(new fromTrendsLandingCardActions.GetOrgIncCountHistoryError()))
      );
    }));

  @Effect()
  deletePeerTrend$ = this.actions$.pipe(
    ofType(fromTrendsLandingCardActions.DELETE_SAVED_TREND),
    map((action: fromTrendsLandingCardActions.DeleteSavedTrend) => action),
    switchMap((action) => {
      const actions = [];
      return this.peerTrendsApiService.deletePeerTrend(action.payload).pipe(
        switchMap((response) => {
          actions.push(new fromTrendsLandingCardActions.DeleteSavedTrendSuccess()) ;
          actions.push(new fromPfDataGridActions.LoadData(PageViewIds.Trends));
          return actions;
        }),
        catchError( () => of(new fromTrendsLandingCardActions.DeleteSavedTrendError()))
      );
    })
  );

  @Effect()
  loadPeerTrendDetails: Observable<Action> = this.actions$.pipe(
    ofType(fromTrendsLandingCardActions.LOAD_SAVED_TREND)).pipe(
    withLatestFrom(
      this.exchangeExplorerContextService.selectFilterContext(),
      (action: fromTrendsLandingCardActions.LoadSavedTrend, filterContext) => ({action, filterContext})),
    switchMap( data =>
      this.peerTrendsApiService.getPeerTrendContext(
        data.action.payload
      ).pipe(
        mergeMap((peerTrendDetails: PeerTrendResponse) => {
          return [
            new fromTrendsLandingCardActions.LoadSavedTrendSuccess(peerTrendDetails)

          ];
        }),
        catchError(() => of(new fromTrendsLandingCardActions.LoadSavedTrendError()))
      )
    ));

  @Effect()
  setSelectedTrendId: Observable<Action> = this.actions$.pipe(
    ofType(fromTrendsLandingCardActions.SET_SELECTED_TREND_ID)).pipe(
    mergeMap(
      (action: fromTrendsLandingCardActions.SetSelectedTrendId) => {

        const actions = [];
        if (!!action.payload) {
          actions.push(new fromComphubSharedPageActions.ResetAccessibleTrendsPages());
          actions.push(new fromComphubSharedPageActions.RemoveAccessiblePages([ComphubPages.TrendsJobs, ComphubPages.TrendsScopes]));
        } else {
          actions.push(new fromComphubSharedPageActions.AddAccessiblePages([ComphubPages.TrendsJobs, ComphubPages.TrendsScopes]));
          actions.push(new fromComphubSharedPageActions.ResetTrendsPagesAccessed());
          actions.push(new fromTrendsSummaryActions.SetTrendsDomain({minDate: new Date(), maxDate: new Date()}));

        }

        actions.push(new fromTrendsSummaryActions.Reset());

          actions.push(new fromComphubSharedPageActions.UpdateFooterContext());
        return actions;
      }
    )
  );

  @Effect()
  loadPeerTrendDetailsSuccess: Observable<Action> = this.actions$.pipe(
    ofType(fromTrendsLandingCardActions.LOAD_SAVED_TREND_SUCCESS)).pipe(
    mergeMap((action: fromTrendsLandingCardActions.LoadSavedTrendSuccess) => {
        const actions = [];

        const savedFilters = this.payfactorsSearchApiModelMapper.mapSearchSavedFilterResponseToSavedFilter(
          [action.payload.ExchangeExplorerScopeContext.SelectedFilterOptions],
          action.payload.SearchFilterMappingData
        );

        const selections = savedFilters[0].Filters;

        actions.push(new fromSearchFiltersActions.ApplySavedFilters(selections));

        actions.push(new fromTrendsSummaryActions.SetTrendsDomain({minDate: action.payload.MinDate, maxDate: action.payload.MaxDate}));

      actions.push(new fromExchangeExplorerMapActions.SetPeerMapBounds({
        TopLeft: action.payload.ExchangeExplorerScopeContext.ScopeTopLeft,
        BottomRight: action.payload.ExchangeExplorerScopeContext.ScopeBottomRight,
        Centroid: null
      }));

        return actions;
      }
    ));

  constructor(
    private actions$: Actions,
    private store: Store<fromComphubSharedReducer.State>,
    private exchangeCompanyApiService: ExchangeCompanyApiService,
    private exchangeExplorerContextService: ExchangeExplorerContextService,
    private exchangeDataSearchApiService: ExchangeDataSearchApiService,
    private peerTrendsApiService: PeerTrendsApiService,
    private payfactorsSearchApiModelMapper: PayfactorsSearchApiModelMapper
  ) {}
}
