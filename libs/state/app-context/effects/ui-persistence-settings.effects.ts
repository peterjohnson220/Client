import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

import { UiPersistenceSettingsApiService } from 'libs/data/payfactors-api';

import * as fromUiPersistenceSettingsActions from '../actions/ui-persistence-settings.actions';
import { UiPersistenceFeatureSettingsModel } from '../../../models/common';

@Injectable()
export class UiPersistenceSettingsEffects {
  @Effect()
  savingUiPersistenceSetting$: Observable<Action> = this.actions$.pipe(
      ofType(fromUiPersistenceSettingsActions.SAVE_UI_PERSISTENCE_SETTING),
      switchMap((action: fromUiPersistenceSettingsActions.SaveUiPersistenceSetting) =>
        this.clientSettingApiService.putUiPersistenceSetting(action.payload).pipe(
          map((response: UiPersistenceFeatureSettingsModel[]) =>
            new fromUiPersistenceSettingsActions.SaveUiPersistenceSettingSuccess(response)),
          catchError(error => of(new fromUiPersistenceSettingsActions.SaveUiPersistenceSettingError(error)))
        )
      )
    );

  @Effect()
  getClientSettings$: Observable<Action> = this.actions$.pipe(
    ofType(fromUiPersistenceSettingsActions.GET_UI_PERSISTENCE_SETTINGS),
      switchMap(() =>
        this.clientSettingApiService.getAllUiPersistenceSettings()),
      map((response: UiPersistenceFeatureSettingsModel[]) =>
        new fromUiPersistenceSettingsActions.GetUiPersistenceSettingsSuccess(response)),
      catchError(error => of (new fromUiPersistenceSettingsActions.GetUiPersistenceSettingsError(error)))
    );

  constructor(private actions$: Actions,
              private clientSettingApiService: UiPersistenceSettingsApiService) {
  }
}
