import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action} from '@ngrx/store';
import { Observable, of, pipe } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { ValidateStepResultItem } from 'libs/models/jdm';
import { JobDescriptionManagementApiService, JobDescriptionApiService } from 'libs/data/payfactors-api/jdm';
import { CompanyApiService } from 'libs/data/payfactors-api/company';
import { CompanyDto } from 'libs/models/company';

import * as fromJobDescriptionLoaderActions from '../actions/job-description-loader.actions';
import { JobDescriptionValidationRequest } from '../models/requests/job-description-validation-request.model';
import { LoadJobDescriptionRequest } from '../models/requests/job-description-load-request.model';
import { JobDescriptionDeleteByTemplateIdData } from '../models/requests/job-description-delete-by-template-id-data.model';
import { PfSuccessFN } from '../actions/job-description-loader.actions';

@Injectable()
export class JobDescriptionLoaderEffects {

  @Effect()
  validateJobDescriptionImport$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJobDescriptionLoaderActions.VALIDATE_JOB_DESCRIPTION_IMPORT),
      map((action: fromJobDescriptionLoaderActions.ValidateJobDescriptionImport) => action.payload),
      switchMap((request: JobDescriptionValidationRequest) => {
        return this.jobDescriptionManagementApiService.validate(request).pipe(
          map((response: ValidateStepResultItem) => {
            return new fromJobDescriptionLoaderActions.ValidateJobDescriptionImportSuccess(response);
          })
        );
    })
  );

  @Effect()
  loadJobDescriptions$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJobDescriptionLoaderActions.LOAD_JOB_DESCRIPTIONS),
      map((action: fromJobDescriptionLoaderActions.LoadJobDescriptions) => action.payload),
      switchMap((request: LoadJobDescriptionRequest) => {
        return this.jobDescriptionManagementApiService.load(request).pipe(
          map((response: ValidateStepResultItem) => {
            return new fromJobDescriptionLoaderActions.LoadJobDescriptionsSuccess(response);
          })
        );
    })
  );

  @Effect()
  loadCompany$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJobDescriptionLoaderActions.LOAD_COMPANY),
      map( (action: fromJobDescriptionLoaderActions.LoadCompany) => action.payload),
      switchMap((request: number) => {
        return this.companyApiService.get(request).pipe(
          map((response: CompanyDto) => {
            return new fromJobDescriptionLoaderActions.LoadCompanySuccess(response);
          })
        );
    })
  );

  @Effect()
  deleteJobDescriptions$ = this.actions$
    .pipe(
      ofType(fromJobDescriptionLoaderActions.DELETE_JOB_DESCRIPTIONS),
      map((action: fromJobDescriptionLoaderActions.DeleteJobDescriptions) => action.payload),
      switchMap((data: JobDescriptionDeleteByTemplateIdData) => {
        return this.jobDescriptionApiService.deleteByTemplateId(data.request).pipe(
          map(() => {
            data.successFn();
            return new fromJobDescriptionLoaderActions.DeleteJobDescriptionsSuccess();
          }),
          catchError(() => of(new fromJobDescriptionLoaderActions.DeleteJobDescriptionsError()))
        );
    })
  );

  constructor(
    private actions$: Actions,
    private jobDescriptionManagementApiService: JobDescriptionManagementApiService,
    private jobDescriptionApiService: JobDescriptionApiService,
    private companyApiService: CompanyApiService
  ) { }
}
