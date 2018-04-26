import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';

import { CompanyApiService } from 'libs/data/payfactors-api/index';
import * as companySettingsActions from '../actions/company-settings.actions';

@Injectable()
export class CompanySettingsEffects {
  @Effect()
  getCompanySettings$ = this.actions$
    .ofType(companySettingsActions.GET_COMPANY_SETTINGS)
    .switchMap(() =>
    this.companyApiService
      .getCompanySettings()
      .map((companySettings: any) => new companySettingsActions.GetCompanySettingsSuccess(companySettings))
      .catch(error => {
        return of (new companySettingsActions.GetCompanySettingsError(error));
      })
    );

  constructor(private actions$: Actions,
              private companyApiService: CompanyApiService) {
  }
}
