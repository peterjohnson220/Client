import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

import { JobDescriptionApiService } from 'libs/data/payfactors-api';

import * as fromCopyJobDescriptionModalActions from '../actions/copy-job-description-modal.actions';
import { PayfactorsApiModelMapper } from 'libs/features/jobs/job-description-management/helpers';

@Injectable()
export class CopyJobDescriptionModalEffects {

  @Effect()
  getJobDescriptionSources$ = this.actions$
    .pipe(
      ofType(fromCopyJobDescriptionModalActions.GET_JOB_DESCRIPTION_SOURCES),
      switchMap((action: fromCopyJobDescriptionModalActions.GetJobDescriptionSources) => {
        return this.jobDescriptionApiService.getJobsAsSourceForJobDescriptionCopyFrom(
          action.payload.jobDescriptionId,
          action.payload.templateId,
          action.payload.jobFamily)
          .pipe(
            map((response) => {
              const sources = PayfactorsApiModelMapper.mapJobDescriptionSourceResponsesToJobDescriptionSources(response);
              return new fromCopyJobDescriptionModalActions.GetJobDescriptionSourcesSuccess(sources);
            }),
            catchError(() => of(new fromCopyJobDescriptionModalActions.GetJobDescriptionSourcesError()))
          );
      })
    );

  @Effect()
  replaceJobDescription$ = this.actions$
    .pipe(
      ofType(fromCopyJobDescriptionModalActions.REPLACE_JOB_DESCRIPTION),
      switchMap((action: fromCopyJobDescriptionModalActions.ReplaceJobDescription) => {
        return this.jobDescriptionApiService.copyFrom(
          action.payload.jobDescriptionId,
          action.payload.jobDescriptionIdToCopyFrom,
          action.payload.jobDescriptionStatus)
          .pipe(
            map((response) => new fromCopyJobDescriptionModalActions.ReplaceJobDescriptionSuccess(response)),
            catchError(() => of(new fromCopyJobDescriptionModalActions.ReplaceJobDescriptionError()))
          );
      })
    );

  constructor(
    private actions$: Actions,
    private jobDescriptionApiService: JobDescriptionApiService
  ) {}

}
