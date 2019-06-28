import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { of, Observable } from 'rxjs';
import { map, catchError, switchMap, debounceTime } from 'rxjs/operators';

import * as fromRelatedJobsAction from '../actions/related-jobs.actions';
import { JobService } from '../services/job.service';
import { Job } from '../models/job';

@Injectable()
export class RelatedJobEffects {
  constructor(
    private actions$: Actions,
    private jobService: JobService) { }

  @Effect()
  load: Observable<Action> = this.actions$
    .pipe(
      ofType(fromRelatedJobsAction.LOAD_RELATED_JOBS),
      switchMap((action: fromRelatedJobsAction.LoadRelatedJobs) => {
        return this.jobService.getRelatedJobs(action.payload.jobId).pipe(
          map((response: Job[]) => {
            return new fromRelatedJobsAction.LoadRelatedJobsSuccess({ relatedJobs: response });
          }),
          catchError(error => of(new fromRelatedJobsAction.LoadRelatedJobsFailure(error)))
        );
      })
    );
}
