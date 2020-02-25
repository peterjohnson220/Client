import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, combineLatest, mergeMap, switchMap } from 'rxjs/operators';

import { CompanySettingsApiService } from 'libs/data/payfactors-api/settings';
import { CompanyApiService } from 'libs/data/payfactors-api/company';

import * as fromCompanySettingActions from 'libs/state/app-context/actions/company-settings.actions';
import * as fromRootState from 'libs/state/state';

import * as fromPasswordSettingActions from '../actions/security-settings.action';
import * as fromCompanyAdminReducer from '../reducers';
import { CompanySetting } from 'libs/models';

@Injectable()
export class SecuritySettingEffects {
  @Effect()
  loadPasswordSettings$ = this.actions$
    .pipe(
      ofType(fromPasswordSettingActions.LOAD_PASSWORD_SETTINGS),
      combineLatest(
        this.store.select(fromRootState.getCompanySettings),
        (action, companySettings) =>
          ({ action, companySettings })
      ),
      mergeMap(data => {
        const actions = [];
        const settings = this.mapCompanySettingsToPasswordSettings(data.companySettings);
        actions.push(new fromPasswordSettingActions.LoadCompanyAdminPasswordSettingsSuccess(settings));
        return actions;
      })
    );

  @Effect()
  savePasswordSettings$ = this.actions$
    .pipe(
      ofType(fromPasswordSettingActions.SAVE_PASSWORD_SETTINGS),
      switchMap((action: fromPasswordSettingActions.SaveCompanyAdminPasswordSettings) =>
        this.companySettingsApiService.putSettings(action.payload).pipe(
          mergeMap(() => {
            const actions = [];
            actions.push(new fromPasswordSettingActions.SaveCompanyAdminPasswordSettingsSuccess());
            actions.push(new fromCompanySettingActions.LoadCompanySettings());
            if (action.payload.Settings.filter(x => x.Name === 'PasswordExpirationEnabled').length > 0) {
              actions.push(new fromPasswordSettingActions.SaveCompanyAdminPasswordSettingsSuccessPost());
            }
            return actions;
          }),
          catchError(e => of(new fromPasswordSettingActions.SaveCompanyAdminPasswordSettingsError()))
        )
      )
    );

  @Effect({ dispatch: false })
  savePasswordSettingsPost$ = this.actions$
    .pipe(
      ofType(fromPasswordSettingActions.SAVE_PASSWORD_SETTINGS_SUCCESS_POST),
      switchMap((action: fromPasswordSettingActions.SaveCompanyAdminPasswordSettingsSuccessPost) =>
        this.companyApiService.setPasswordExpiration().pipe(
          mergeMap(() => [null])
        )
      )
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromCompanyAdminReducer.State>,
    private companySettingsApiService: CompanySettingsApiService,
    private companyApiService: CompanyApiService
  ) { }

  mapCompanySettingsToPasswordSettings(response: CompanySetting[]): CompanySetting[] {
    if (!response || !response.length) {
      return [];
    }
    return response.filter(item => item.Key.indexOf('Password') > -1 || item.Key.indexOf('Session') > -1);
  }
}
