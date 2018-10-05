import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { of, Observable } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

import * as fromJobDetailAction from '../actions/job-detail.actions';
import { JobService } from '../../shared/services/job.service';

@Injectable()
export class JobDetailEffects {
  constructor(
    private actions$: Actions,
    private jobService: JobService) { }

  @Effect()
  loadJob: Observable<Action> = this.actions$
    .ofType(fromJobDetailAction.LOAD_JOB).pipe(
      switchMap((action: fromJobDetailAction.LoadJob) => {
        return this.jobService.getJob(action.payload.id).pipe(
          map((response: any) => {
            return new fromJobDetailAction.LoadJobSuccess({ job: response });
          }),
          catchError(error => of(new fromJobDetailAction.LoadJobFailure(error)))
        );
      })
    );
}
