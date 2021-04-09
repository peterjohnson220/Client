import { Injectable } from '@angular/core';

import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { ExchangeCompanyApiService } from 'libs/data/payfactors-api/peer';

import { TrendsLandingCardConstants } from '../constants/trends-landing-card-constants';
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

  constructor(
    private actions$: Actions,
    private store: Store<fromComphubMainReducer.State>,
    private exchangeCompanyApiService: ExchangeCompanyApiService
  ) {}
}
