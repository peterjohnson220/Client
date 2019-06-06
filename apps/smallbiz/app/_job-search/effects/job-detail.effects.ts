import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { of, Observable } from 'rxjs';
import { map, catchError, switchMap, withLatestFrom, tap } from 'rxjs/operators';

import * as fromJobDetailAction from '../actions/job-detail.actions';
import * as fromJobSearch from '../reducers';
import { JobService } from '../services/job.service';
import { Job } from '../models/job';

@Injectable()
export class JobDetailEffects {
  constructor(
    private actions$: Actions,
    private jobService: JobService,
    private store: Store<fromJobSearch.State>) { }

  @Effect()
  loadJob: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJobDetailAction.LOAD_JOB),
      withLatestFrom(this.store.select(fromJobSearch.selectJob),
        (action: fromJobDetailAction.LoadJob, selectedJob: Job) => ({ action, selectedJob })),
      switchMap((jobAndAction) => {
        if (!!jobAndAction.selectedJob) {
          return of(new fromJobDetailAction.LoadJobSuccess({ job: jobAndAction.selectedJob }));
        } else {
          return this.jobService.getJob(jobAndAction.action.payload.id).pipe(
            map((job: Job) => {
              return new fromJobDetailAction.LoadJobSuccess({ job });
            }),
            catchError(error => of(new fromJobDetailAction.LoadJobFailure(error)))
          );
        }
      })
    );
}
