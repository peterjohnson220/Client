import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Action, select, Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { ExchangeCompanyApiService } from 'libs/data/payfactors-api/peer';

import * as fromCompanyJobsActions from '../actions/company-jobs.actions';
import * as fromReducers from '../reducers';

@Injectable()
export class CompanyJobsEffects {

  @Effect()
  loadCompanyJobs$: Observable<Action> = this.actions$.pipe(
    ofType(fromCompanyJobsActions.LOAD_COMPANY_JOBS),
    // grab grid state
    withLatestFrom(
      this.store.pipe(
        select(fromReducers.getCompanyJobsGridState)),
        (action, gridState) => gridState
    ),
    // grab the search term
    withLatestFrom(
      this.store.pipe(
        select(fromReducers.getCompanyJobsSearchTerm)),
        (gridState, searchTerm) => ({ gridState, searchTerm })
    ),
    // make the call to the api service, then fire a success/failure action
    switchMap(combined => (
      this.exchangeCompanyApiService.getActiveCompanyJobs(combined.gridState, [], combined.searchTerm).pipe(
        map((gridDataResult: GridDataResult) => new fromCompanyJobsActions.LoadCompanyJobsSuccess(gridDataResult)),
        catchError((error: HttpErrorResponse ) => {
          if (error.status === 400 && error.error.Message.includes('Paging')) {
            return of(new fromCompanyJobsActions.LoadCompanyJobsPagingError(error.error.Message));
          } else {
            return of(new fromCompanyJobsActions.LoadCompanyJobsError());
          }
        })
      )
    ))
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromReducers.State>,
    private exchangeCompanyApiService: ExchangeCompanyApiService
  ) {}
}
