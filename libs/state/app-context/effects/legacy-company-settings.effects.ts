import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { CompanyApiService } from 'libs/data/payfactors-api';

import * as legacyCompanySettingsActions from '../actions/legacy-company-settings.actions';

@Injectable()
export class LegacyCompanySettingsEffects {
  @Effect()
  getCompanySettings$ = this.actions$.pipe(
      ofType(legacyCompanySettingsActions.GET_COMPANY_SETTINGS),
      switchMap(() =>
        this.companyApiService.getCompanySettings().pipe(
          map((companySettings: any) => new legacyCompanySettingsActions.GetCompanySettingsSuccess(companySettings)),
          catchError(error => {
            return of (new legacyCompanySettingsActions.GetCompanySettingsError(error));
          })
        )
      )
    );

  constructor(private actions$: Actions,
              private companyApiService: CompanyApiService) {
  }
}
