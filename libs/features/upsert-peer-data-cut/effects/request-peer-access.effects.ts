import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { map, catchError, switchMap } from 'rxjs/operators';

import * as fromRootState from 'libs/state/state';
import * as fromUiPersistenceSettingsActions from 'libs/state/app-context/actions/ui-persistence-settings.actions';
import { ExchangeCompanyApiService } from 'libs/data/payfactors-api/peer';
import { FeatureAreaConstants, UiPersistenceSettingConstants } from 'libs/models/common';

import * as fromRequestPeerAccessActions from '../actions';

@Injectable()
export class RequestPeerAccessEffects {
  @Effect()
  requestPeerAccess$: Observable<Action> = this.actions$.pipe(
    ofType(fromRequestPeerAccessActions.REQUEST_PEER_ACCESS),
    switchMap(() =>
      this.exchangeCompanyApiService.requestPeerAccess().pipe(
        map(() => {
          return new fromRequestPeerAccessActions.RequestPeerAccessSuccess();
        }),
        catchError(() => of(new fromRequestPeerAccessActions.RequestPeerAccessError()))
      )
    )
  );

  @Effect()
  requestPeerAccessSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(fromRequestPeerAccessActions.REQUEST_PEER_ACCESS_SUCCESS),
    map(() => new fromUiPersistenceSettingsActions.SaveUiPersistenceSetting(
      {
        FeatureArea: FeatureAreaConstants.Project,
        SettingName: UiPersistenceSettingConstants.PeerAccessRequested,
        SettingValue: 'true'
      }
    ))
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromRootState.State>,
    private exchangeCompanyApiService: ExchangeCompanyApiService
  ) {}
}
