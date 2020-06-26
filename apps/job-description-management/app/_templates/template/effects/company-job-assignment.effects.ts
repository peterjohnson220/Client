import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { SaveCompanyJobsJobDescriptionTemplateIdRequest } from 'libs/models/payfactors-api';
import { JobDescriptionTemplateApiService } from 'libs/data/payfactors-api';
import { CompanyJobApiService } from 'libs/data/payfactors-api/company';
import { CompanyJob } from 'libs/models/company';
import { MessageHelper } from 'libs/core';

import * as fromCompanyJobActions from '../actions';

@Injectable()
export class CompanyJobAssignmentEffects {
    @Effect()
    getJobsByFamilyNotAssignedToTemplate$: Observable<Action> = this.actions$
    .pipe(
        ofType(fromCompanyJobActions.LOAD_JOBS_BY_FAMILY_WITH_NO_TEMPLATE),
        switchMap((action: fromCompanyJobActions.LoadJobsByFamilyWithNoTemplate) => {
        return this.companyJobApiService.getJobsByFamilyNotAssignedToTemplate(action.payload.jobFamily, action.payload.templateId).pipe(
            map((response: CompanyJob) => {
            return new fromCompanyJobActions.LoadJobsByFamilyWithNoTemplateSuccess(response);
            }),
            catchError(response => of(new fromCompanyJobActions.LoadJobsByFamilyWithNoTemplateError(
                { errorMessage: MessageHelper.buildErrorMessage('Error loading jobs by family with no template.')}
            )))
        );
        }));

    @Effect()
    getJobsByFamilyAssignedToTemplate$: Observable<Action> = this.actions$
    .pipe(
        ofType(fromCompanyJobActions.LOAD_JOBS_BY_FAMILY_WITH_TEMPLATE),
        switchMap((action: fromCompanyJobActions.LoadJobsByFamilyWithTemplate) => {
        return this.companyJobApiService.getJobsByFamilyWithTemplate(action.payload.jobFamily, action.payload.templateId).pipe(
            map((response: CompanyJob) => {
            return new fromCompanyJobActions.LoadJobsByFamilyWithTemplateSuccess(response);
            }),
            catchError(response => of(new fromCompanyJobActions.LoadJobsByFamilyWithTemplateError(
                { errorMessage: MessageHelper.buildErrorMessage('Error loading jobs by family with template.')}
            )))
        );
        }));

    @Effect()
    saveCompanyJobTemplateAssignment$: Observable<Action> = this.actions$
    .pipe(
        ofType(fromCompanyJobActions.SAVE_COMPANY_JOB_TEMPLATE_ASSIGNMENT),
        switchMap((action: fromCompanyJobActions.SaveCompanyJobTemplateAssignment) => {
            const request: SaveCompanyJobsJobDescriptionTemplateIdRequest = {
                  companyJobIdsToAssign: action.payload.companyJobIdsToAssign,
                  companyJobIdsToUnassign: action.payload.companyJobIdsToUnassign
                };
            return this.jobDescriptionTemplateApiService.saveCompanyJobsJobDescriptionTemplateId(action.payload.templateId, request).pipe(
                map((response: CompanyJob) => {
                    return new fromCompanyJobActions.SaveCompanyJobTemplateAssignmentSuccess();
                }),
                catchError(response => of(new fromCompanyJobActions.SaveCompanyJobTemplateAssignmentError(response)))
            );
        }));

  constructor(
    private actions$: Actions,
    private companyJobApiService: CompanyJobApiService,
    private jobDescriptionTemplateApiService: JobDescriptionTemplateApiService
  ) {}
}
