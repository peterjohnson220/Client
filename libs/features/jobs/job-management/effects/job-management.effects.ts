import { Injectable } from '@angular/core';

import { Observable, of, forkJoin } from 'rxjs';
import cloneDeep from 'lodash/cloneDeep';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store, select } from '@ngrx/store';
import { map, switchMap, catchError, mergeMap, withLatestFrom } from 'rxjs/operators';

import { EditableJobDescriptionPipe } from 'libs/core';
import { CompanyJob, CompanyJobAttachment, UserContext, JobDescriptionSummary } from 'libs/models';
import { ApiServiceType } from 'libs/features/notes/notes-manager/constants/api-service-type-constants';
import {
  CompanyJobApiService,
  StructuresApiService,
  StructureRangeGroupApiService,
  DashboardApiService,
  JobsApiService
} from 'libs/data/payfactors-api';

import * as fromRootState from 'libs/state/state';
import * as fromJobManagementReducer from '../reducers';
import * as fromJobManagementActions from '../actions';
import * as fromNotesManagerReducer from '../../../notes/notes-manager/reducers';
import * as fromNotesManagerActions from '../../../notes/notes-manager/actions';

import { ToastrService } from 'ngx-toastr';

@Injectable()
export class JobManagementEffects {

  editableJobDescription = new EditableJobDescriptionPipe();

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
    private structuresApiService: StructuresApiService,
    private structuresRangeGroupApiService: StructureRangeGroupApiService,
    private dashboardApiService: DashboardApiService,
    private rootStore: Store<fromRootState.State>,
    private store: Store<fromJobManagementReducer.State>,
    private toastr: ToastrService,
    private jobsApiService: JobsApiService
  ) { }

  @Effect()
  loadJobOptions$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJobManagementActions.LOAD_JOB_OPTIONS),
      switchMap((action: fromJobManagementActions.LoadJobOptions) =>
        forkJoin(
          this.companyJobApiService.getJobFamilies(),
          this.companyJobApiService.getCompanyFLSAStatuses(),
          this.companyJobApiService.getJobUserDefinedFields(),
          this.structuresApiService.getCurrentStructuresWithValidPaymarkets(),
          this.dashboardApiService.getIsJdmEnabled())
          .pipe(
            mergeMap((options) => [
              new fromJobManagementActions.LoadJobOptionsSuccess(options[0], options[1], options[2], options[3], options[4]),
              new fromJobManagementActions.LoadStructurePaymarketGrade()
            ]),
            catchError(() => of(new fromJobManagementActions.HandleApiError('There was an error loading the job information')))
          )
      )
    );

  @Effect()
  loadStructurePaymarketGrade$: Observable<Action> = this.actions$
    .pipe(
      ofType(
        fromJobManagementActions.RESET_STATE,
        fromJobManagementActions.LOAD_STRUCTURE_PAYMARKET_GRADE,
        fromJobManagementActions.SET_SELECTED_STRUCTURE_ID),
      mergeMap((loadStructurePaymarketGradeAction: fromJobManagementActions.LoadStructurePaymarketGrade) =>
        of(loadStructurePaymarketGradeAction).pipe(
          withLatestFrom(
            this.store.pipe(select(fromJobManagementReducer.getSelectedStructureId)),
            (action: fromJobManagementActions.LoadStructurePaymarketGrade, structureId) => ({ action, structureId })
          )
        ),
      ),
      switchMap((data) =>
        this.structuresApiService.getStructurePaymarketsAndGrades(data.structureId ? data.structureId : -1).pipe(
          map((structurePaymarketGrade) => new fromJobManagementActions.LoadStructurePaymarketGradeSuccess(structurePaymarketGrade)),
          catchError(() => of(new fromJobManagementActions.HandleApiError('There was an error loading the job structure information')))
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
          catchError(() => of(new fromJobManagementActions.HandleApiError('There was an error loading the job information')))
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
            catchError(() => of(new fromJobManagementActions.HandleApiError('There was an error while uploading your attachments')))
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
            this.store.pipe(select(fromJobManagementReducer.getJobDescriptionSummary)),
            this.store.pipe(select(fromJobManagementReducer.getJobFormData)),
            this.store.pipe(select(fromJobManagementReducer.getAttachments)),
            this.store.pipe(select(fromJobManagementReducer.getJobId)),
            (action: fromJobManagementActions.SaveCompanyJob, userContext, jobDescriptionSummary, jobFormData, attachments, jobId) =>
              ({ action, userContext, jobDescriptionSummary, jobFormData, attachments, jobId })
          )
        ),
      ),
      switchMap((data) => {
        const updatedCompanyJob: CompanyJob =
          this.buildCompanyJobRequest(
            data.userContext,
            cloneDeep(data.jobDescriptionSummary),
            cloneDeep(data.jobFormData),
            cloneDeep(data.attachments),
            data.jobId);

        return this.companyJobApiService
          .saveCompanyJob(updatedCompanyJob)
          .pipe(
            map((response: CompanyJob) => {
              return new fromJobManagementActions.SaveStructureMappings(data.jobId > 0 ? data.jobId : response.CompanyJobId);
            }),
            catchError(response => {
              if (response.status === 409) {
                return of(new fromJobManagementActions.SetDuplicateJobCodeError(true));
              } else {
                return of(new fromJobManagementActions.HandleApiError(
                  'There was an error saving your job information. Please contact you service associate for assistance.'));
              }
            })
          );
      }));

  @Effect()
  saveStructureMappings$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJobManagementActions.SAVE_STRUCTURE_MAPPINGS),
      mergeMap((saveStructureMappings: fromJobManagementActions.SaveStructureMappings) =>
        of(saveStructureMappings).pipe(
          withLatestFrom(
            this.store.pipe(select(fromJobManagementReducer.getStructures)),
            this.store.pipe(select(fromNotesManagerReducer.getNotes)),
            (action: fromJobManagementActions.SaveStructureMappings, structures, notes) =>
              ({ action, structures, notes })
          )
        ),
      ),
      switchMap((data) => {
        // reset Ids of newly added structure mappings to 0
        const updatedStructures = data.structures.map(s => ({
          ...s,
          CompanyStructuresRangeGroupId: s.CompanyStructuresRangeGroupId > 0 ? s.CompanyStructuresRangeGroupId : 0
        }));

        return this.structuresRangeGroupApiService
          .addJobStructureMapping(data.action.jobId, updatedStructures)
          .pipe(
            map(() => {
              if (data.notes.obj.length > 0) {
                return new fromNotesManagerActions.SaveNotes(data.action.jobId, ApiServiceType.CompanyJobs);
              } else {
                return new fromJobManagementActions.SaveCompanyJobSuccess();
              }
            }),
            catchError(() => {
              return of(new fromJobManagementActions.HandleApiError(
                'There was an error saving your job information. Please contact you service associate for assistance.'));
            })
          );
      }));

  @Effect()
  exportJobDescription$ = this.actions$.pipe(
    ofType(fromJobManagementActions.EXPORT_JOB_DESCRIPTION),
    switchMap((action: fromJobManagementActions.ExportJobDescription) => {
      return this.jobsApiService.exportJobDescription(action.payload).pipe(
        map((response) => new fromJobManagementActions.ExportJobDescriptionSuccess()),
        catchError(() => of(new fromJobManagementActions.ExportJobDescriptionError()))
      );
    })
  );


  @Effect()
  handleApiError$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJobManagementActions.HANDLE_API_ERROR),
      switchMap((action: fromJobManagementActions.HandleApiError) => {
        this.handleError(action.payload);
        return of(null);
      })
    );


  private buildCompanyJobRequest(
    userContext: UserContext,
    jobDescriptionSummary: JobDescriptionSummary,
    updatedCompanyJob: CompanyJob,
    attachments: CompanyJobAttachment[],
    jobId: number): CompanyJob {

    updatedCompanyJob.CompanyId = userContext.CompanyId;

    if (!this.editableJobDescription.transform(jobDescriptionSummary)) {
      delete updatedCompanyJob.JobDescription;
    }

    if (jobId) {
      updatedCompanyJob.CompanyJobId = jobId;
    } else {
      updatedCompanyJob.JobStatus = true;
    }

    if (attachments) {
      updatedCompanyJob.CompanyJobsAttachments = attachments
        .map(file => ({
          ...file,
          CompanyJobID: jobId ? jobId : -1,
          CompanyID: userContext.CompanyId.toString(),
        }));
    }
    this.trimValues(updatedCompanyJob);

    return updatedCompanyJob;
  }

  // This should be extracted into a common interceptor of http errors
  private handleError(message: string, title: string = 'Error'): void {
    const toastContent = `
    <div class="message-container"><div class="alert-triangle-icon mr-3"></div>${message}</div>`;
    this.toastr.error(toastContent, title, this.toastrOverrides);
  }

  // This should be extracted into a common libs function
  private trimValues(job: any) {
    Object.keys(job).forEach(key => { job[key] = typeof job[key] === 'string' || job[key] instanceof String ? job[key].trim() : job[key]; });
  }
}
