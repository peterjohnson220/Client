import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { CompanyJobApiService } from 'libs/data/payfactors-api/company';
import { MessageHelper } from 'libs/core';

import * as fromJobFamilyActions from 'libs/features/jobs/job-description-management/actions/job-family.actions';

@Injectable()
export class JobFamilyEffects {
  @Effect()
  loadJobFamilies$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJobFamilyActions.LOAD_JOB_FAMILIES),
      switchMap((action: fromJobFamilyActions.LoadJobFamilies) =>
        this.companyJobApiService.getJobFamilies().pipe(
          map((response: string[]) => {
            return new fromJobFamilyActions.LoadJobFamiliesSuccess(response);
          }),
          catchError(response => of(new fromJobFamilyActions.LoadJobFamiliesError({
            errorMessage: MessageHelper.buildErrorMessage('Error loading job families.')
          })))
        )
      ));

  constructor(
    private actions$: Actions,
    private companyJobApiService: CompanyJobApiService
  ) {}
}
