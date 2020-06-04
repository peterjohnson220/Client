import { Injectable } from '@angular/core';


import { select, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';

import * as fromUserSettingsPageActions from '../actions/market-data-feed-page.actions';
import * as fromMarketDataFeedPageReducer from '../reducers';

@Injectable()
export class MarketDataFeedPageEffects {

  constructor(
    private actions$: Actions,
    private store: Store<fromMarketDataFeedPageReducer.State>,
  ) {}
}

