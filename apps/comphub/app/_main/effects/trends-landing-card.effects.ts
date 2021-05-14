import { Injectable } from '@angular/core';

import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { ExchangeCompanyApiService } from 'libs/data/payfactors-api/peer';

import { TrendsLandingCardConstants } from '../constants/trends-landing-card-constants';
import * as fromComphubMainReducer from '../reducers/comphub-page.reducer';
import * as fromTrendsLandingCardActions from '../actions/trends-landing-card.actions';

import { ExchangeExplorerContextService } from 'libs/features/peer/exchange-explorer/services';
import { ExchangeDataSearchApiService } from 'libs/data/payfactors-api/search/peer';
import { CalendarInterval, HistoricalExchangeDataSearchRequest } from 'libs/models/payfactors-api/peer/exchange-data-search/request';
import { ExchangeDataSearchFilterContext } from 'libs/models/peer';


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
      } as HistoricalExchangeDataSearchRequest

      return this.exchangeDataSearchApiService.getOrgIncCountHistory(request).pipe(
        map((response) => {
          return new fromTrendsLandingCardActions.GetOrgIncCountHistorySuccess(response.OrgIncCountCollection);
        }),
        catchError(() => of(new fromTrendsLandingCardActions.GetOrgIncCountHistoryError()))
      );
    }));

  constructor(
    private actions$: Actions,
    private store: Store<fromComphubMainReducer.State>,
    private exchangeCompanyApiService: ExchangeCompanyApiService,
    private exchangeExplorerContextService: ExchangeExplorerContextService,
    private exchangeDataSearchApiService: ExchangeDataSearchApiService
  ) {}
}
