import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { ConfigurationGroupApiService, OrganizationalDataApiService } from 'libs/data/payfactors-api/organizational-data';

import * as fromOrganizationalDataActions from '../actions/organizational-data-page.action';
import { ConfigurationGroup } from '../models';

@Injectable()
export class OrganizationalDataPageEffects {
  @Effect()
  getOrganizationalHeadersLink$: Observable<Action> = this.actions$.pipe(
    ofType(fromOrganizationalDataActions.GET_ORGANIZATIONAL_HEADERS_LINK),
    switchMap((action: fromOrganizationalDataActions.GetOrganizationalHeadersLink) =>
      this.organizationalDataApiService.getOrganizationalHeadersLink().pipe(
        map((link: string) => {
          return new fromOrganizationalDataActions.GetOrganizationalHeadersLinkSuccess(link);
        }),
        catchError(error => of(new fromOrganizationalDataActions.GetOrganizationalHeadersLinkError()))
      )
    )
  );

  @Effect()
  getConfigurationGroup$: Observable<Action> = this.actions$.pipe(
    ofType(fromOrganizationalDataActions.GET_CONFIGURATION_GROUP),
    switchMap((action: fromOrganizationalDataActions.GetConfigGroup) =>
      this.configurationGroupApiService.getConfigurationGroup(action.companyId).pipe(
        map((configGroup: ConfigurationGroup) => {
          return new fromOrganizationalDataActions.GetConfigGroupSuccess(configGroup);
        }),
        catchError(error => of(new fromOrganizationalDataActions.GetConfigGroupFailed()))
      )
    )
  );

  constructor(
    private actions$: Actions,
    private organizationalDataApiService: OrganizationalDataApiService,
    private configurationGroupApiService: ConfigurationGroupApiService,
  ) { }
}



