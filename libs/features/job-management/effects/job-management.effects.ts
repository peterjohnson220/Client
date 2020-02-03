import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';

import * as cloneDeep from 'lodash.clonedeep';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store, select } from '@ngrx/store';
import { map, switchMap, catchError, mergeMap, withLatestFrom } from 'rxjs/operators';

import { CompanyJobApiService } from 'libs/data/payfactors-api/company';
import { CompanyJob } from 'libs/models';
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
  saveCompanyJob$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJobManagementActions.SAVE_COMPANY_JOB),
      mergeMap((saveCompanyJobAction: fromJobManagementActions.SaveCompanyJob) =>
        of(saveCompanyJobAction).pipe(
          withLatestFrom(
            this.rootStore.pipe(select(fromRootState.getUserContext)),
            this.store.pipe(select(fromJobManagementReducer.getCompanyJob)),
            (action: fromJobManagementActions.SaveCompanyJob, userContext, companyJob) =>
              ({ action, userContext, companyJob })
          )
        ),
      ),
      switchMap((data) => {
        const newCompanyJob = cloneDeep(data.companyJob);
        newCompanyJob.CompanyId = data.userContext.CompanyId;
        newCompanyJob.JobStatus = true;
        this.trimValues(newCompanyJob);
        return this.companyJobApiService
          .createCompanyJob(newCompanyJob)
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
