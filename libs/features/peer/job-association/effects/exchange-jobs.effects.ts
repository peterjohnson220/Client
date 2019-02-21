import { Injectable } from '@angular/core';
import { Action, select, Store } from '@ngrx/store';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { JobAssociationApiService } from 'libs/data/payfactors-api/peer/job-association-api.service';

import * as fromPeerJobsActions from '../actions/exchange-jobs.actions';
import * as fromPeerJobsReducer from '../reducers';

@Injectable()
export class ExchangeJobsEffects {

  @Effect()
  getExchangeJobs$: Observable<Action> = this.actions$.pipe(
    ofType(fromPeerJobsActions.LOAD_EXCHANGE_JOBS),
    // grab list state
    withLatestFrom(
      this.store.pipe(
        select(fromPeerJobsReducer.getExchangeJobsGrid)),
        (action, listState) => listState
    ),
    // make the call to the api service, then fire a success/failure action
    switchMap(combined =>
      this.jobAssociationApiService.loadExchangeJobs(combined.grid).pipe(
        map((gridDataResult: GridDataResult) => new fromPeerJobsActions.LoadExchangeJobsSuccess(gridDataResult)),
        catchError(() => of(new fromPeerJobsActions.LoadExchangeJobsError())
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private jobAssociationApiService: JobAssociationApiService,
    private store: Store<fromPeerJobsReducer.State>,
  ) {}
}
