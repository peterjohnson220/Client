import { Injectable } from '@angular/core';
import { Action, select, Store } from '@ngrx/store';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap, mergeMap, withLatestFrom } from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { JobAssociationApiService } from 'libs/data/payfactors-api/peer/job-association-api.service';
import { GenericMenuItem } from 'libs/models/common';

import * as fromPeerJobsActions from '../actions/exchange-jobs.actions';
import * as fromPeerJobsReducer from '../reducers';
import { IGridState } from 'libs/core/reducers/grid.reducer';

@Injectable()
export class ExchangeJobsEffects {
  @Effect()
  load$ = this.actions$.pipe(
    ofType(fromPeerJobsActions.LOAD),
    mergeMap(() => [new fromPeerJobsActions.LoadExchangeJobs(), new fromPeerJobsActions.LoadJobFamilyFilter()])
  );

  @Effect()
  getExchangeJobs$: Observable<Action> = this.actions$.pipe(
    ofType(fromPeerJobsActions.LOAD_EXCHANGE_JOBS),
    // grab list state
    withLatestFrom(
      this.store.pipe(
        select(fromPeerJobsReducer.getExchangeJobsGrid)),
        (action, gridState: IGridState) => gridState
    ),
    // grab the search term
    withLatestFrom(
      this.store.pipe(
        select(fromPeerJobsReducer.getExchangeJobsSearchTerm)),
        (gridState: IGridState, searchTerm) => ({ gridState, searchTerm })
    ),
    // grab the selected job families
    withLatestFrom(
      this.store.pipe(
        select(fromPeerJobsReducer.getExchangeJobFamilyFilterSelectedOptionNames)),
        (combined, jobFamilies: string[]) => ({ ...combined, jobFamilies })
    ),
    // make the call to the api service, then fire a success/failure action
    switchMap(combined =>
      this.jobAssociationApiService.loadExchangeJobs(combined.gridState.grid, combined.searchTerm,
        combined.jobFamilies).pipe(map((gridDataResult: GridDataResult) =>
          new fromPeerJobsActions.LoadExchangeJobsSuccess(gridDataResult)
        ),
        catchError(() => of(new fromPeerJobsActions.LoadExchangeJobsError())
        )
      )
    )
  );

  @Effect()
  getJobFamilies$: Observable<Action> = this.actions$.pipe(
    ofType(fromPeerJobsActions.LOAD_JOB_FAMILY_FILTER),
    switchMap(() =>
      this.jobAssociationApiService.loadJobFamilies().pipe(
        map((jobFamilies: GenericMenuItem[]) => new fromPeerJobsActions.LoadJobFamilyFilterSuccess(jobFamilies)),
        catchError(() => of(new fromPeerJobsActions.LoadJobFamilyFilterError()))
      )
    )
  );

  constructor(
    private actions$: Actions,
    private jobAssociationApiService: JobAssociationApiService,
    private store: Store<fromPeerJobsReducer.State>,
  ) {}
}
