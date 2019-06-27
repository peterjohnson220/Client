import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { of, Observable } from 'rxjs';
import { map, catchError, switchMap, debounceTime } from 'rxjs/operators';

import * as fromJobSearchAction from '../actions/job-search.actions';
import * as fromJobDetailAction from '../actions/job-detail.actions';
import { JobService } from '../services/job.service';
import { JobSearchResult } from '../models/job-search-result';

@Injectable()
export class JobSearchEffects {
  constructor(
    private actions$: Actions,
    private jobService: JobService,
    private router: Router) { }

  @Effect()
  search: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJobSearchAction.JOB_SEARCH),
      debounceTime(300),
      switchMap((action: fromJobSearchAction.JobSearch) => {
        return this.jobService.search(action.payload.searchTerm).pipe(
          map((response: JobSearchResult) => {
            return new fromJobSearchAction.JobSearchSuccess({ searchResult: response });
          }),
          catchError(error => of(new fromJobSearchAction.JobSearchFailure(error)))
        );
      })
    );

  @Effect()
  jobSelected: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJobSearchAction.JOB_SELECTED),
      switchMap((action: fromJobSearchAction.JobSelected) => {
        return of(new fromJobDetailAction.LoadJobSuccess({ job: action.payload.selected }));
      })
    );

  @Effect({ dispatch: false })
  jobSelectedRoute = this.actions$
    .pipe(
      ofType(fromJobSearchAction.JOB_SELECTED),
      map((action: fromJobSearchAction.JobSelected) => {
        this.router.navigate(['/job', action.payload.selected.id]);
      })
    );
}
