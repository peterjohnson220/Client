import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';

import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { ToastrService } from 'ngx-toastr';

import { JobsApiService, PayMarketApiService, CompanyJobApiService, UiPersistenceSettingsApiService } from 'libs/data/payfactors-api';
import { StructuresApiService } from 'libs/data/payfactors-api/structures';
import { FeatureAreaConstants, UiPersistenceSettingConstants } from 'libs/models';

import * as fromPfDataGridActions from 'libs/features/pf-data-grid/actions';
import * as fromJobManagementActions from 'libs/features/job-management/actions';

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
    switchMap((data: any) => {
      return this.jobsApiService.createProject(data.payload).pipe(
        mergeMap((projectId: number) => {
          window.location.href = `/marketdata/marketdata.asp?usersession_id=${projectId}`;
          // TODO: When we migrate the Projects page to Client we have to make sure the state is cleared if we return back to the Jobs page
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
      (action: fromJobManagementActions.SaveCompanyJobSuccess, jobsPageId) =>
        ({ action, jobsPageId })
    ),
    switchMap(data => [
      new fromPfDataGridActions.LoadData(data.jobsPageId),
      new fromPfDataGridActions.CloseSplitView(data.jobsPageId)
    ])
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
    switchMap((action: any) => {
      return this.jobsApiService.exportPricings(action.payload).pipe(
        map(response => new fromJobsPageActions.ExportPricingsSuccess(action.payload)),
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
  toggleJobsPage$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobsPageActions.TOGGLE_JOBS_PAGE),
    switchMap((action: fromJobsPageActions.ToggleJobsPage) => {
      return this.uiPersistenceSettingsApiService.putUiPersistenceSetting({
        FeatureArea: FeatureAreaConstants.Jobs,
        SettingName: UiPersistenceSettingConstants.JobsPagePreference,
        SettingValue: 'Legacy'
      }).pipe(
        mergeMap(response => {
          const me = this;
          window.addEventListener('onunload', function () {
            me.store.dispatch(new fromJobsPageActions.ToggleJobsPageSuccess());
          });
          window.location.href = `/marketdata/jobs.asp`;
          return [];
        }),
        catchError(error => {
          return this.handleError('Error saving Jobs page preference. Please contact Payfactors Support for assistance',
            'Error', new fromJobsPageActions.ToggleJobsPageError());
        })
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

}

