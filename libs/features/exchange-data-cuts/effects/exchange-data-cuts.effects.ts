import {Actions, Effect, ofType} from '@ngrx/effects';
import {Injectable} from '@angular/core';
import {Action} from '@ngrx/store';
import {Observable, of} from 'rxjs/index';
import * as fromExchangeDataCutsActions from '../actions/exchange-data-cuts.actions';
import {catchError, map, switchMap} from 'rxjs/operators';
import * as fromPricingDetailsActions from '../../pricing-details/actions';
import {ExchangeDataCutsApiService} from '../../../data/payfactors-api/peer/exchange-data-cuts-api.service';

@Injectable()
export class ExchangeDataCutsEffects {
  constructor(
    private actions$: Actions,
    private exchangeDataCutsApiService: ExchangeDataCutsApiService) {
  }

  @Effect()
  loadExchangeDataCut$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromExchangeDataCutsActions.LOAD_PEER_DATA_CUT),
      switchMap(
        (action: fromExchangeDataCutsActions.LoadPeerDataCut) =>
          this.exchangeDataCutsApiService.getDataCutFilter(action.filterGUID).pipe(
            map((dataCut: any) => {
              return new fromExchangeDataCutsActions.LoadPeerDataCutSuccess(dataCut);
            }),
            catchError(response => of(new fromExchangeDataCutsActions.GetExchangeDataCutError()))
          )
      )
    );
}
