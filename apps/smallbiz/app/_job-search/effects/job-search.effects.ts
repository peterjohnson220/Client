import { Injectable } from '@angular/core';

import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { of, Observable } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

import * as fromJobSearchAction from '../actions/job-search.actions';
import { JobService } from '../../shared/services/job.service';

@Injectable()
export class JobSearchEffects {
  constructor(
    private actions$: Actions,
    private jobService: JobService) { }

  @Effect()
  search: Observable<Action> = this.actions$
    .ofType(fromJobSearchAction.JOB_SEARCH).pipe(
      switchMap((action: fromJobSearchAction.JobSearch) => {
        return this.jobService.search(action.payload.searchTerm).pipe(
          map((response: any) => {
            return new fromJobSearchAction.JobSearchSuccess({ searchResults: response });
          }),
          catchError(error => of(new fromJobSearchAction.JobSearchFailure(error)))
        );
      })
    );
}
