import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import {Action, select, Store} from '@ngrx/store';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import {ExchangeCompanyApiService} from 'libs/data/payfactors-api/peer/exchange-company-api.service';

import * as fromJobPeerMatchesActions from '../actions';

@Injectable()
export class JobPeerMatchesEffects {

  constructor(
    private actions$: Actions,
    private exchangeCompanyApiService: ExchangeCompanyApiService,
  ) { }

  @Effect()
  loadJobDescription$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobPeerMatchesActions.LOAD_JOB_PEER_MATCHES),
    switchMap((data: any) => {
      return this.exchangeCompanyApiService.getAssociatedExchangeJobs(data.payload).pipe(
        map((result: any) => new fromJobPeerMatchesActions.LoadJobPeerMatchesSuccess(result)),
        catchError(error => {
          const msg = 'We encountered an error while loading your company data';
          return of(new fromJobPeerMatchesActions.HandleApiError(msg));
        })
      );
    })
  );
}

