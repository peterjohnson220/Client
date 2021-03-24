import { Injectable } from '@angular/core';
import cloneDeep from 'lodash/cloneDeep';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';

import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { ToastrService } from 'ngx-toastr';

import { JobsApiService, PayMarketApiService, CompanyJobApiService, UiPersistenceSettingsApiService } from 'libs/data/payfactors-api';
import { StructuresApiService } from 'libs/data/payfactors-api/structures';
import { CompanyJob } from 'libs/models';
import * as fromPfDataGridActions from 'libs/features/grids/pf-data-grid/actions';
import * as fromJobManagementActions from 'libs/features/jobs/job-management/actions';
import * as fromJobManagementReducer from 'libs/features/jobs/job-management/reducers';
import * as fromPfDataGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import * as fromFeatureFlagRedirectReducer from 'libs/state/state';
import { PageRedirectUrl } from 'libs/models/url-redirect/page-redirect-url';
import { UrlPage } from 'libs/models/url-redirect/url-page';
import { UrlRedirectHelper } from 'libs/core/helpers/url-redirect-helper';

import * as fromJobsPageActions from '../actions';
import * as fromJobsReducer from '../reducers';
import { PageViewIds } from '../constants';


@Injectable()
export class JobsPageEffects {

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
    private jobsApiService: JobsApiService,
    private payMarketApiService: PayMarketApiService,
    private structureApiService: StructuresApiService,
    private uiPersistenceSettingsApiService: UiPersistenceSettingsApiService,
    private store: Store<fromJobsReducer.State>,
    private toastr: ToastrService
  ) { }

  @Effect()
  createProject$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobsPageActions.CREATING_PROJECT),
    withLatestFrom(
      this.store.select(fromFeatureFlagRedirectReducer.getPageRedirectUrl, {page: UrlPage.PricingProject}),
      (action: fromJobsPageActions.CreatingProject, redirectUrl: string) => ({action, redirectUrl})
    ),
    switchMap((data: any) => {
      return this.jobsApiService.createProject(data.action.payload).pipe(
        mergeMap((projectId: number) => {
          window.location.href = UrlRedirectHelper.getIdParamUrl(data.redirectUrl, projectId.toString());

          return [];
        }),
        catchError(error => of(new fromJobsPageActions.CreatingProjectError(error)))
      );
    })
  );

  @Effect()
  changeJobStatus$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobsPageActions.CHANGING_JOB_STATUS),
    switchMap((data: any) => {
      return this.companyJobApiService.changeJobStatus(data.payload).pipe(
        mergeMap(() =>
          [
            new fromJobsPageActions.ChangingJobStatusSuccess(),
            new fromPfDataGridActions.ClearSelections(PageViewIds.PayMarkets),
            new fromPfDataGridActions.ClearSelections(PageViewIds.Jobs),
            new fromPfDataGridActions.UpdatePagingOptions(PageViewIds.Jobs, fromPfDataGridReducer.DEFAULT_PAGING_OPTIONS),
            new fromPfDataGridActions.LoadData(PageViewIds.Jobs),
            new fromPfDataGridActions.CloseSplitView(PageViewIds.Jobs),
          ]),
        catchError(error => of(new fromJobsPageActions.ChangingJobStatusError(error)))
      );
    })
  );

  @Effect()
  deleteJob$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobsPageActions.DELETING_JOB),
    switchMap((data: any) => {
      return this.companyJobApiService.deleteCompanyJob(data.payload).pipe(
        mergeMap(() => [
          new fromJobsPageActions.DeletingJobSuccess(),
          new fromPfDataGridActions.ClearSelections(PageViewIds.Jobs, [data.payload]),
          new fromPfDataGridActions.LoadData(PageViewIds.Jobs),
        ]),
        catchError(error => of(new fromJobsPageActions.DeletingJobError(error)))
      );
    })
  );

  @Effect()
  saveCompanyJobSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobManagementActions.SAVE_COMPANY_JOB_SUCCESS),
    withLatestFrom(
      this.store.pipe(select(fromJobsReducer.getJobsPageId)),
      this.store.pipe(select(fromJobManagementReducer.getJobFormData)),
      this.store.pipe(select(fromPfDataGridReducer.getSelectedRow)),
      (action: fromJobManagementActions.SaveCompanyJobSuccess, jobsPageId, jobFormData, selectedRow) =>
        ({ action, jobsPageId, jobFormData, selectedRow })
    ),
    switchMap(data => {
      const actions = [];
      if (!!data.selectedRow) {
        const updatedSelectedRow = this.mapJobFormDataToSelectedRow(data.selectedRow, data.jobFormData);
        actions.push(new fromPfDataGridActions.UpdateSelectedRow(updatedSelectedRow, data.jobsPageId));
      }
      actions.push(new fromPfDataGridActions.LoadData(data.jobsPageId));
      return actions;
    })
  );

  @Effect()
  loadCompanyPayMarkets$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobsPageActions.LOAD_COMPANY_PAYMARKETS),
    switchMap(() => {
      return this.payMarketApiService.getAll().pipe(
        map(options => new fromJobsPageActions.LoadCompanyPayMarketsSuccess(options)),
        catchError(error => {
          const msg = 'We encountered an error while loading your company data';
          return of(new fromJobsPageActions.HandleApiError(msg));
        })
      );
    })
  );

  @Effect()
  loadStructureGrades$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobsPageActions.LOAD_STRUCTURE_GRADES),
    switchMap((action: any) => {
      return this.structureApiService.getGradeNames().pipe(
        map(grades => new fromJobsPageActions.LoadStructureGradesSuccess(grades)),
        catchError(error => {
          const msg = 'We encountered an error while loading your company data';
          return of(new fromJobsPageActions.HandleApiError(msg));
        })
      );
    })
  );

  @Effect()
  exportPricings$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobsPageActions.EXPORT_PRICINGS),
    switchMap((action: fromJobsPageActions.ExportPricings) => {
      return this.jobsApiService.exportPricings(action.payload).pipe(
        map(response => new fromJobsPageActions.ExportPricingsSuccess(response)),
        catchError(error => {
          return this.handleError('Error creating export. Please contact Payfactors Support for assistance', 'Error',
            new fromJobsPageActions.ExportPricingsError(action.payload));
        })
      );
    })
  );

  @Effect()
  loadCustomExports$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobsPageActions.LOAD_CUSTOM_EXPORTS),
    switchMap((action: any) => {
      return this.jobsApiService.loadCustomExports().pipe(
        map(response => new fromJobsPageActions.LoadCustomExportsSuccess(response)),
        catchError(error => {
          const msg = 'We encountered an error while loading your company data';
          return of(new fromJobsPageActions.HandleApiError(msg));
        })
      );
    })
  );

  @Effect()
  getRunningExport$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobsPageActions.GET_RUNNING_EXPORT),
    switchMap((action: fromJobsPageActions.GetRunningExport) => {
      return this.jobsApiService.getRunningExport(action.pageViewId).pipe(
        map((response) => new fromJobsPageActions.GetRunningExportSuccess(response)),
        catchError(() => of(new fromJobsPageActions.GetRunningExportError()))
      );
    })
  );

  private handleError(message: string, title: string = 'Error',
    resultingAction: Action = new fromJobsPageActions.HandleApiError(message)
  ): Observable<Action> {
    const toastContent = `<div class="message-container"><div class="alert-triangle-icon mr-3"></div>${message}</div>`;
    this.toastr.error(toastContent, title, this.toastrOverrides);
    return of(resultingAction);
  }

  private mapJobFormDataToSelectedRow(selectedRow: any, jobFormData: CompanyJob) {
    const updatedSelectedRow = cloneDeep(selectedRow);
    updatedSelectedRow.CompanyJobs_Job_Code = jobFormData.JobCode;
    updatedSelectedRow.CompanyJobs_Job_Title = jobFormData.JobTitle;
    updatedSelectedRow.CompanyJobs_Job_Family = jobFormData.JobFamily;
    updatedSelectedRow.CompanyJobs_Job_Level = jobFormData.JobLevel;
    updatedSelectedRow.CompanyJobs_FLSA_Status = jobFormData.FLSAStatus;
    return updatedSelectedRow;
  }
}

