import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { CompanyJobApiService } from 'libs/data/payfactors-api/company';
import { CompanyJobUdfColumn } from 'libs/models/jdm/company-job-udf-column';
import { CompanyJob } from 'libs/models/company';

import * as fromAddJobModalActions from '../../_job-description/actions/add-job-modal.actions';

@Injectable()
export class AddJobModalEffects {
  @Effect()
  createCompanyJob$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromAddJobModalActions.CREATE_COMPANY_JOB),
      switchMap((action: fromAddJobModalActions.CreateCompanyJob) => {
        return this.companyJobApiService.createCompanyJob(action.payload).pipe(
          map((response: CompanyJob) => {
            return new fromAddJobModalActions.CreateCompanyJobSuccess(response);
          }),
          catchError(response => of(new fromAddJobModalActions.CreateCompanyJobError(response)))
        );
      }));

  @Effect()
  loadCompanyJobUdfColumns$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromAddJobModalActions.LOAD_COMPANY_JOB_UDF_COLUMNS),
      switchMap((action: fromAddJobModalActions.LoadCompanyJobUdfColumns) =>
        this.companyJobApiService.getJobUserDefinedFields().pipe(
          map((response: CompanyJobUdfColumn[]) => {
            return new fromAddJobModalActions.LoadCompanyJobUdfColumnsSuccess(response);
          }),
          catchError(response => of(new fromAddJobModalActions.LoadCompanyJobUdfColumnsError()))
        )
      ));

  @Effect()
  createCompanyJobError: Observable<Action> = this.actions$
  .pipe(
    ofType(fromAddJobModalActions.CREATE_COMPANY_JOB_ERROR),
      map((response: any) => {
          if (response.payload.status === 409) {
            return new fromAddJobModalActions.SetDuplicateCompanyJobMessage({errorMessage: 'Duplicate job code'});
          }
        })
    );

  constructor(
    private actions$: Actions,
    private companyJobApiService: CompanyJobApiService
  ) {}
}
