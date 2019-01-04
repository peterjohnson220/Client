import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { IntegrationApiService } from 'libs/data/payfactors-api/integration';
import { AuthRedirectRequest } from 'libs/models/dashboard';

import * as fromCompositeSummaryDownloadActions from '../actions/composite-summary-download.actions';


@Injectable()
export class CompositeSummaryDownloadEffects {
  @Effect()
  authRedirectAttempted$: Observable<Action> = this.actions$
    .ofType(fromCompositeSummaryDownloadActions.AUTH_REDIRECT_ATTEMPTED).pipe(
      switchMap((action: fromCompositeSummaryDownloadActions.AuthRedirectAttempted) => {
        const request: AuthRedirectRequest = {
          Id: action.payload.compositeDataLoadExternalId,
          Action: action.payload.action
        };
        return this.integrationApiService.authRedirect(request);
      })
    );

  constructor(
    private actions$: Actions,
    private integrationApiService: IntegrationApiService
  ) {

  }
}

