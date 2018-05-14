import { Injectable } from '@angular/core';

import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { UiPersistenceSettingsApiService } from 'libs/data/payfactors-api/ui-persistence-settings';
import * as fromUiPersistenceSettingsActions from '../actions/ui-persistence-settings.actions';
import { GenericNameValueDto } from '../../../models/common';

@Injectable()
export class UiPersistenceSettingsEffects {
  @Effect()
  savingUiPersistenceSetting$: Observable<Action> = this.actions$
    .ofType(fromUiPersistenceSettingsActions.SAVE_UI_PERSISTENCE_SETTING)
    .switchMap((action: fromUiPersistenceSettingsActions.SaveUiPersistenceSetting) =>
      this.clientSettingApiService.putUiPersistenceSetting(action.payload)
        .map((response: GenericNameValueDto[]) =>
          new fromUiPersistenceSettingsActions.SaveUiPersistenceSettingSuccess(response))
        .catch(error => of(new fromUiPersistenceSettingsActions.SaveUiPersistenceSettingError(error)))
    );

  @Effect()
  getClientSettings$: Observable<Action> = this.actions$
    .ofType(fromUiPersistenceSettingsActions.GET_UI_PERSISTENCE_SETTINGS)
    .switchMap((action: fromUiPersistenceSettingsActions.GetUiPersistenceSettings) =>
    this.clientSettingApiService.getUiPersistenceSettings(action.payload))
      .map((response: GenericNameValueDto[]) =>
        new fromUiPersistenceSettingsActions.GetUiPersistenceSettingsSuccess(response))
      .catch(error => of (new fromUiPersistenceSettingsActions.GetUiPersistenceSettingsError(error)));

  constructor(private actions$: Actions,
              private clientSettingApiService: UiPersistenceSettingsApiService) {
  }
}
