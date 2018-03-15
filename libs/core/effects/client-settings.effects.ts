import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';
import { ClientSettingsApiService } from 'libs/data/payfactors-api/client-settings';
import * as fromClientSettingsActions from '../actions/client-settings.actions';
import { of } from 'rxjs/observable/of';


@Injectable()
export class ClientSettingsEffects {
  @Effect()
  savingEffectiveDate$: Observable<Action> = this.actions$
    .ofType(fromClientSettingsActions.SAVING_CLIENT_SETTING)
    .switchMap((action: fromClientSettingsActions.SavingClientSetting) =>
      this.clientSettingApiService.putClientSetting(action.payload)
        .map((response: string) => new fromClientSettingsActions.SavingClientSettingSuccess(''))
        .catch(error => of(new fromClientSettingsActions.SavingClientSettingError('')))
    );

  constructor(private actions$: Actions,
              private clientSettingApiService: ClientSettingsApiService) {
  }
}
