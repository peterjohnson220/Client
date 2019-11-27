import {Injectable} from '@angular/core';

import {Actions, Effect, ofType} from '@ngrx/effects';
import {catchError, map, switchMap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {Action} from '@ngrx/store';

import { JobDescriptionApiService } from 'libs/data/payfactors-api/jdm';

import * as fromJobDescriptionVersionCompareActions from '../actions/job-description-version-compare.actions';

@Injectable()
export class JobDescriptionVersionCompareEffects {

  @Effect()
  loadJobDescriptionComparison$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJobDescriptionVersionCompareActions.LOAD_JOB_DESCRIPTION_COMPARISON),
      switchMap((action: fromJobDescriptionVersionCompareActions.LoadJobDescriptionComparison) =>
        this.jobDescriptionApiService.getVersionCompare(
          action.payload.jobDescriptionId,
          action.payload.revisionNumber,
          action.payload.previousRevisionNumber).pipe(
          map((response) => {
            return new fromJobDescriptionVersionCompareActions.LoadJobDescriptionComparisonSuccess(response);
          }),
          catchError(response => of(new fromJobDescriptionVersionCompareActions.LoadJobDescriptionComparisonError()))
        )
      ));

  constructor(
    private actions$: Actions,
    private jobDescriptionApiService: JobDescriptionApiService
  ) {}
}
