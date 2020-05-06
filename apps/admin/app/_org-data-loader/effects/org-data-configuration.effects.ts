import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { catchError, map, switchMap } from 'rxjs/operators';

import { OrgDataLoaderConfigurationApiService } from 'libs/data/payfactors-api/data-loads';

import * as fromOrgDataConfigurationActions from '../actions/org-data-loader-configuration.actions';

@Injectable()
export class OrgDataConfigurationEffects {
  @Effect()
  saveConfiguration$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromOrgDataConfigurationActions.SAVE_CONFIGURATION),
      map((action: fromOrgDataConfigurationActions.SaveConfiguration) => action.payload),
      switchMap(payload => {
        return this.orgDataLoaderConfigurationApiService.saveConfiguration(payload).pipe(
          map(() => new fromOrgDataConfigurationActions.SaveConfigurationSuccess()),
          catchError(() => of(new fromOrgDataConfigurationActions.SaveConfigurationError()))
        );
      })
    );


  constructor(
    private actions$: Actions,
    private orgDataLoaderConfigurationApiService: OrgDataLoaderConfigurationApiService
  ) {}
}
