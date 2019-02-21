import { Injectable } from '@angular/core';
import { Action, select, Store } from '@ngrx/store';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';

import * as fromCompanyJobsActions from '../actions/company-jobs.actions';
import * as fromReducer from '../reducers';
import { ExchangeCompanyApiService } from '../../../../data/payfactors-api/peer';

@Injectable()
export class CompanyJobsEffects {

  @Effect()
  loadExchangeJobs$: Observable<Action> = this.actions$.pipe(
    ofType(fromCompanyJobsActions.LOAD_COMPANY_JOBS),
    // grab list state
    withLatestFrom(
      this.store.pipe(
        select(fromReducer.getCompanyJobsGridState)),
      (action, listState) => listState
    ),
    // make the call to the api service, then fire a success/failure action
    switchMap(combined =>
      this.exchangeCompanyApiService.getActiveNonAssociatedCompanyJobs(combined).pipe(
        map((grid) => new fromCompanyJobsActions.LoadCompanyJobsSuccess(grid)),
        catchError(() => of(new fromCompanyJobsActions.LoadCompanyJobsError())
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private exchangeCompanyApiService: ExchangeCompanyApiService,
    private store: Store<fromReducer.State>,
  ) {}
}
