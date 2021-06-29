import { Injectable } from '@angular/core';

import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { ExchangeCompanyApiService } from 'libs/data/payfactors-api/peer';
import * as fromPfDataGridActions from 'libs/features/grids/pf-data-grid/actions';
import { ExchangeExplorerContextService } from 'libs/features/peer/exchange-explorer/services';
import { ExchangeDataSearchApiService } from 'libs/data/payfactors-api/search/peer';
import { PeerTrendsApiService} from 'libs/data/payfactors-api/peer/peer-trends-api.service';
import { CalendarInterval, HistoricalExchangeDataSearchRequest } from 'libs/models/payfactors-api/peer/exchange-data-search/request';
import { ExchangeDataSearchFilterContext } from 'libs/models/peer';

import { TrendsLandingCardConstants } from '../constants/trends-landing-card-constants';
import { PageViewIds } from '../constants/page-view-id-constants';
import * as fromComphubMainReducer from '../reducers/comphub-page.reducer';
import * as fromTrendsLandingCardActions from '../actions/trends-landing-card.actions';

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

  constructor(
    private actions$: Actions,
    private store: Store<fromComphubMainReducer.State>,
    private exchangeCompanyApiService: ExchangeCompanyApiService,
    private exchangeExplorerContextService: ExchangeExplorerContextService,
    private exchangeDataSearchApiService: ExchangeDataSearchApiService,
    private peerTrendsApiService: PeerTrendsApiService
  ) {}
}
