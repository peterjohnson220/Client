import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { CompanySettingsApiService } from 'libs/data/payfactors-api';
import { CompanySetting } from 'libs/models/company';

import * as companySettingsActions from '../actions/company-settings.actions';

@Injectable()
export class CompanySettingsEffects {
  @Effect()
  getCompanySettings$ = this.actions$.pipe(
      ofType(companySettingsActions.LOAD_COMPANY_SETTINGS),
      switchMap(() =>
        this.companySettingsApiService.getSettings().pipe(
          map((companySettings: CompanySetting[]) => new companySettingsActions.LoadCompanySettingsSuccess(companySettings)),
          catchError(error => {
            return of (new companySettingsActions.LoadCompanySettingsError(error));
          })
        )
      )
    );

  constructor(private actions$: Actions,
              private companySettingsApiService: CompanySettingsApiService) {
  }
}
