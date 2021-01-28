import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { CompanyJobApiService } from 'libs/data/payfactors-api/company';
import { JobDescriptionManagementApiService } from 'libs/data/payfactors-api';

import * as fromJobDescriptionLibraryActions from 'libs/features/jobs/job-description-management/actions/job-description-library.actions';
import { JobDescriptionLibraryBucket, JobDescriptionLibraryResult } from 'libs/features/jobs/job-description-management/models';

@Injectable()
export class JobDescriptionLibraryEffects {
  @Effect()
  loadJobDescriptionLibraryResultsByBucket$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJobDescriptionLibraryActions.LOAD_JOB_DESCRIPTION_LIBRARY_RESULTS_BY_BUCKET),
      switchMap((action: fromJobDescriptionLibraryActions.LoadJobDescriptionLibraryResultsByBucket) =>
        this.jobDescriptionManagementApiService.getLibrarySearchResultsByBucket(action.payload).pipe(
          map((response: JobDescriptionLibraryBucket[]) => {
            return new fromJobDescriptionLibraryActions.LoadJobDescriptionLibraryResultsByBucketSuccess({
              buckets: response,
              selectedBucket: action.payload.BucketKey
            });
          }),
          catchError(response => of(new fromJobDescriptionLibraryActions.LoadJobDescriptionLibraryResultsByBucketError()))
        )
      ));

  @Effect()
  loadJobDescriptionLibraryResults$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJobDescriptionLibraryActions.LOAD_JOB_DESCRIPTION_LIBRARY_RESULTS),
      switchMap((action: fromJobDescriptionLibraryActions.LoadJobDescriptionLibraryResults) =>
        this.jobDescriptionManagementApiService.getLibrarySearchResults(action.payload).pipe(
          map((response: JobDescriptionLibraryResult[]) => {
            return new fromJobDescriptionLibraryActions.LoadJobDescriptionLibraryResultsSuccess(response);
          }),
          // todo: determine if change these to individual errors
          catchError(response => of(new fromJobDescriptionLibraryActions.LoadJobDescriptionLibraryResultsError()))
        )
      ));

  constructor(
    private actions$: Actions,
    private companyJobApiService: CompanyJobApiService,
    private jobDescriptionManagementApiService: JobDescriptionManagementApiService ) {
  }
}
