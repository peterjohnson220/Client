import { Injectable } from '@angular/core';
import { Action, select, Store } from '@ngrx/store';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

import * as fromCompanyJobsActions from '../actions/company-jobs.actions';
import * as fromReducer from '../reducers';
import { ExchangeCompanyApiService } from '../../../../data/payfactors-api/peer';

@Injectable()
export class CompanyJobsEffects {
  @Effect()
  init$ = this.actions$.pipe(
    ofType(fromCompanyJobsActions.LOAD),
    mergeMap(() => [new fromCompanyJobsActions.LoadCompanyJobs()])
  );

  @Effect()
  loadCompanyJobs$: Observable<Action> = this.actions$.pipe(
    ofType(fromCompanyJobsActions.LOAD_COMPANY_JOBS),
    // grab list state
    withLatestFrom(
      this.store.pipe(
        select(fromReducer.getCompanyJobsGridState)),
      (action, listState) => listState
    ),
    withLatestFrom(this.store.pipe(
      select(fromReducer.getCompanyJobIdFilters)),
      (listState, companyJobIds) => ({listState, companyJobIds})
    ),
    withLatestFrom(this.store.pipe(select(fromReducer.getCompanyJobsSearchTerm)),
      ({listState, companyJobIds}, searchTerm) => ({listState, companyJobIds, searchTerm})
    ),
    // make the call to the api service, then fire a success/failure action
    switchMap(combined => (
      this.exchangeCompanyApiService.getActiveNonAssociatedCompanyJobs(
          combined.listState, combined.companyJobIds, combined.searchTerm).pipe(
            map((grid) => new fromCompanyJobsActions.LoadCompanyJobsSuccess(grid)),
        catchError((error: HttpErrorResponse ) => {
          if (error.status === 400) {
            return of(new fromCompanyJobsActions.LoadCompanyJobsBadRequest(error.error.Message));
          } else {
            return of(new fromCompanyJobsActions.LoadCompanyJobsError(error.error.Message));
          }
        })
      )
    ))
  );

  constructor(
    private actions$: Actions,
    private exchangeCompanyApiService: ExchangeCompanyApiService,
    private store: Store<fromReducer.State>,
  ) {}
}
