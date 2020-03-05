import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';

import * as cloneDeep from 'lodash.clonedeep';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store, select } from '@ngrx/store';
import { map, switchMap, catchError, mergeMap, withLatestFrom } from 'rxjs/operators';

import { CompanyJobApiService } from 'libs/data/payfactors-api/company';
import { CompanyJob, CompanyJobAttachment, UserContext, Company } from 'libs/models';
import * as fromRootState from 'libs/state/state';

import * as fromJobManagementReducer from '../reducers';
import * as fromJobManagementActions from '../actions';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class JobManagementEffects {

  private readonly toastrOverrides = {
    positionClass: 'toast-top-center',
    tapToDismiss: true,
    enableHtml: true,
    preventDuplicates: true,
    preventOpenDuplicates: true,
    closeButton: true,
    showMethod: 'fadeIn',
    disableTimeOut: true,
  };

  constructor(
    private actions$: Actions,
    private companyJobApiService: CompanyJobApiService,
    private rootStore: Store<fromRootState.State>,
    private store: Store<fromJobManagementReducer.State>,
    private toastr: ToastrService,
  ) { }

  @Effect()
  loadJobOptions$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJobManagementActions.LOAD_JOB_OPTIONS),
      switchMap((action: fromJobManagementActions.LoadJobOptions) =>
        forkJoin(
          this.companyJobApiService.getJobFamilies(),
          this.companyJobApiService.getCompanyFLSAStatuses(),
          this.companyJobApiService.getJobUserDefinedFields()
        ).pipe(
          map((options) => {
            return new fromJobManagementActions.LoadJobOptionsSuccess(options[0], options[1], options[2]);
          }),
          catchError(response => this.handleError('There was an error loading the job information'))
        )
      )
    );

  @Effect()
  loadJob$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJobManagementActions.LOAD_JOB),
      mergeMap((loadJobAction: fromJobManagementActions.LoadJob) =>
        of(loadJobAction).pipe(
          withLatestFrom(
            this.store.pipe(select(fromJobManagementReducer.getJobId)),
            (action: fromJobManagementActions.LoadJob, jobId) => ({ action, jobId })
          )
        ),
      ),
      switchMap((data) =>
        this.companyJobApiService.getCompanyJob(data.jobId).pipe(
          map((job) => new fromJobManagementActions.LoadJobSuccess(job)),
          catchError(response => this.handleError('There was an error loading the job information'))
        )
      )
    );

  @Effect()
  uploadAttachments$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJobManagementActions.UPLOAD_ATTACHMENTS),
      switchMap(
        (action: fromJobManagementActions.UploadAttachments) =>
          this.companyJobApiService.uploadAttachments(action.attachments).pipe(
            map((attachments: CompanyJobAttachment[]) => new fromJobManagementActions.UploadAttachmentsSuccess(attachments)),
            catchError(response => {
              return this.handleError('There was an error while uploading your attachments');
            })
          )
      )
    );

  @Effect()
  saveCompanyJob$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJobManagementActions.SAVE_COMPANY_JOB),
      mergeMap((saveCompanyJobAction: fromJobManagementActions.SaveCompanyJob) =>
        of(saveCompanyJobAction).pipe(
          withLatestFrom(
            this.rootStore.pipe(select(fromRootState.getUserContext)),
            this.store.pipe(select(fromJobManagementReducer.getJobFormData)),
            this.store.pipe(select(fromJobManagementReducer.getAttachments)),
            this.store.pipe(select(fromJobManagementReducer.getJobId)),
            (action: fromJobManagementActions.SaveCompanyJob, userContext, jobFormData, attachments, jobId) =>
              ({ action, userContext, jobFormData, attachments, jobId })
          )
        ),
      ),
      switchMap((data) => {
        const newCompanyJob: CompanyJob = this.buildCompanyJobRequest(data.userContext, cloneDeep(data.jobFormData), cloneDeep(data.attachments), data.jobId);
        return this.companyJobApiService
          .saveCompanyJob(newCompanyJob)
          .pipe(
            map((response: CompanyJob) => {
              return new fromJobManagementActions.SaveCompanyJobSuccess();
            }),
            catchError(response => {
              if (response.status === 409) {
                return of(new fromJobManagementActions.SetDuplicateJobCodeError(true));
              } else {
                return this.handleError('There was an error saving your job information. Please contact you service associate for assistance.');
              }
            })
          );
      }));

  private buildCompanyJobRequest(userContext: UserContext, newCompanyJob: CompanyJob, attachments: CompanyJobAttachment[], jobId: number): CompanyJob {
    newCompanyJob.CompanyId = userContext.CompanyId;
    newCompanyJob.JobStatus = true;
    if (jobId) {
      newCompanyJob.CompanyJobId = jobId;
    }

    if (attachments && attachments.length > 0) {
      newCompanyJob.CompanyJobsAttachments = attachments
        .map(file => ({
          ...file,
          CompanyJobID: jobId ? jobId : -1,
          CompanyID: userContext.CompanyId.toString(),
        }));
    }
    this.trimValues(newCompanyJob);

    return newCompanyJob;
  }

  private handleError(message: string, title: string = 'Error'): Observable<Action> {
    const toastContent = `
    <div class="message-container"><div class="alert-triangle-icon mr-3"></div>${message}</div>`;
    this.toastr.error(toastContent, title, this.toastrOverrides);
    return of(new fromJobManagementActions.HandleApiError(message));
  }

  private trimValues(job: CompanyJob) {
    Object.keys(job).forEach(key => { job[key] = typeof job[key] === 'string' || job[key] instanceof String ? job[key].trim() : job[key]; });
  }
}
