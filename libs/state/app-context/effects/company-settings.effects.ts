import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { CompanyApiService } from 'libs/data/payfactors-api';
import * as companySettingsActions from '../actions/company-settings.actions';

@Injectable()
export class CompanySettingsEffects {
  @Effect()
  getCompanySettings$ = this.actions$
    .ofType(companySettingsActions.GET_COMPANY_SETTINGS).pipe(
      switchMap(() =>
        this.companyApiService.getCompanySettings().pipe(
          map((companySettings: any) => new companySettingsActions.GetCompanySettingsSuccess(companySettings)),
          catchError(error => {
            return of (new companySettingsActions.GetCompanySettingsError(error));
          })
        )
      )
    );

  constructor(private actions$: Actions,
              private companyApiService: CompanyApiService) {
  }
}
