import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, combineLatest, mergeMap, switchMap } from 'rxjs/operators';

import { CompanySettingsApiService } from 'libs/data/payfactors-api/settings';
import * as fromCompanySettingActions from 'libs/state/app-context/actions/company-settings.actions';
import * as fromRootState from 'libs/state/state';

import * as fromPasswordSettingActions from '../actions/password-management-settings.action';
import * as fromCompanyAdminReducer from '../reducers';
import { PayfactorsApiModelMapper } from '../helpers';

@Injectable()
export class PasswordSettingEffects {
  @Effect()
  loadPasswordSettings$ = this.actions$
    .ofType(fromPasswordSettingActions.LOAD_PASSWORD_SETTINGS)
    .pipe(
      combineLatest(
        this.store.select(fromRootState.getCompanySettings),
        (action, companySettings) =>
          ({action, companySettings})
      ),
      mergeMap(data => {
        const actions = [];
        const settings = PayfactorsApiModelMapper.mapCompanySettingsToPasswordSettings(data.companySettings);
        actions.push(new fromPasswordSettingActions.LoadCompanyAdminPasswordSettingsSuccess(settings));
        return actions;
      })
    );

  @Effect()
  savePasswordSettings$ = this.actions$
    .ofType(fromPasswordSettingActions.SAVE_PASSWORD_SETTINGS)
    .pipe(
      switchMap((action: fromPasswordSettingActions.SaveCompanyAdminPasswordSettings) =>
        this.companySettingsApiService.putSettings(action.payload).pipe(
          mergeMap(() => [new fromPasswordSettingActions.SaveCompanyAdminPasswordSettingsSuccess(),
                                   new fromPasswordSettingActions.SaveCompanyAdminPasswordSettingsPromptClose(),
                                   new fromCompanySettingActions.LoadCompanySettings()]),
          catchError(e => of(new fromPasswordSettingActions.SaveCompanyAdminPasswordSettingsError()))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromCompanyAdminReducer.State>,
    private companySettingsApiService: CompanySettingsApiService
  ) {}
}
