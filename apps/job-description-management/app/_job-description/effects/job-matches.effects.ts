import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { JobDescriptionApiService } from 'libs/data/payfactors-api/jdm';

import * as fromJobMatchesActions from '../actions/job-matches.actions';
import { JobMatchResult } from '../models';
import { PayfactorsApiModelMapper } from '../../shared/helpers';

@Injectable()
export class JobMatchesEffects {

  @Effect()
  getJobMatches$ = this.actions$
    .pipe(
      ofType(fromJobMatchesActions.GET_JOB_MATCHES),
      switchMap((action: fromJobMatchesActions.GetJobMatches) => {
        return this.jobDescriptionApiService.getJobMatches(action.payload.jobDescriptionId)
          .pipe(
            map((response) => {
              const jobMatches: JobMatchResult[] = PayfactorsApiModelMapper.mapJobMatchResultResponsesToJobMatchResults(response);
              return new fromJobMatchesActions.GetJobMatchesSuccess(jobMatches);
            }),
            catchError(() => of(new fromJobMatchesActions.GetJobMatchesError()))
          );
      })
    );

  constructor(
    private actions$: Actions,
    private jobDescriptionApiService: JobDescriptionApiService
  ) {}
}
