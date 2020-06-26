import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';

import { ConfigurationGroupApiService } from 'libs/data/payfactors-api/organizational-data';
import { ConfigurationGroup } from 'libs/models/data-loads';

import * as fromConfigurationGroupActions from '../actions/configuration-groups.actions';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable()
export class LoaderConfigurationGroupsEffects {

  @Effect()
  loadConfigurationGroups: Observable<Action> = this.actions$
    .pipe(
      ofType(fromConfigurationGroupActions.LOADING_CONFIGURATION_GROUPS),
      switchMap((action: fromConfigurationGroupActions.LoadingConfigurationGroups) =>
        this.loaderConfigurationGroupsApi.getConfigurationGroups(action.payload.CompanyId, action.payload.LoadType).pipe(
          map((result: ConfigurationGroup[]) => {
            return new fromConfigurationGroupActions.LoadingConfigurationGroupsSuccess(result);
          }),
          catchError(error => of(new fromConfigurationGroupActions.LoadingConfigurationGroupsError()))
        )
      )
    );

  constructor(private actions$: Actions,
              private loaderConfigurationGroupsApi: ConfigurationGroupApiService) {}
}
