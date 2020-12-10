import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { PayMarketApiService } from 'libs/data/payfactors-api/paymarket';

import * as fromUserSettingsReducer from '../reducers';
import * as fromPayMarketDefaultSettingsActions from '../actions/paymarket-default-settings.actions';
import { ProjectApiService } from 'libs/data/payfactors-api';
import { PayMarketCutHelper } from 'libs/models/paymarket';
import { SavePayMarketsCutsRequest } from 'libs/models/payfactors-api';

@Injectable()
export class PayMarketDefaultSettingsEffects {

  @Effect()
  getPayMarkets$ = this.actions$
    .pipe(
      ofType(fromPayMarketDefaultSettingsActions.GET_PAY_MARKETS),
      switchMap((action: fromPayMarketDefaultSettingsActions.GetPayMarkets) => {
        return this.payMarketApiService.getAll()
          .pipe(
            map((response) => new fromPayMarketDefaultSettingsActions.GetPayMarketsSuccess(response)),
            catchError(() => of(new fromPayMarketDefaultSettingsActions.GetPayMarketsError()))
          );
      })
    );

  @Effect()
  getPayMarketCuts$ = this.actions$
    .pipe(
      ofType(fromPayMarketDefaultSettingsActions.GET_PAY_MARKET_CUTS),
      switchMap((action: fromPayMarketDefaultSettingsActions.GetPayMarketCuts) => {
        return this.projectApiService.getPayMarketCuts(action.payload.payMarketId)
          .pipe(
            map((response) => new fromPayMarketDefaultSettingsActions.GetPayMarketCutsSuccess(response)),
            catchError(() => of(new fromPayMarketDefaultSettingsActions.GetPayMarketCutsError()))
          );
      })
    );

  @Effect()
  savePayMarketCuts$ = this.actions$
    .pipe(
      ofType(fromPayMarketDefaultSettingsActions.SAVE_PAY_MARKET_CUTS),
      withLatestFrom(
        this.store.select(fromRootState.getUserContext),
        (action: fromPayMarketDefaultSettingsActions.SavePayMarketCuts, userContext) =>
          ({ action, userContext })
      ),
      switchMap((data) => {
        const mdCutModels = PayMarketCutHelper.mapPayMarketCutsToPayMarketMDCutModels(data.action.payload.dataCuts, data.userContext.UserId);
        const request: SavePayMarketsCutsRequest = {
          PayMarketCuts: mdCutModels,
          PayMarketIds: [ data.action.payload.payMarketId ]
        };
        return this.projectApiService.savePayMarketsCuts(request)
          .pipe(
            map(() => new fromPayMarketDefaultSettingsActions.SavePayMarketCutsSuccess(data.action.payload.dataCuts)),
            catchError(() => of(new fromPayMarketDefaultSettingsActions.SavePayMarketCutsError()))
          );
      })
    );

  constructor(
    private actions$: Actions,
    private payMarketApiService: PayMarketApiService,
    private projectApiService: ProjectApiService,
    private store: Store<fromUserSettingsReducer.State>
  ) {}
}
