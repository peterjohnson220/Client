import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';

import { catchError, map, mergeMap, switchMap, withLatestFrom, concatMap } from 'rxjs/operators';
import { Observable, of, pipe } from 'rxjs';

import { ToastrService } from 'ngx-toastr';

import {
  JobsApiService,
  PayMarketApiService,
  PricingApiService,
  CompanyJobApiService,
  UiPersistenceSettingsApiService,
  PricingLegacyApiService,
  DataViewApiService,
} from 'libs/data/payfactors-api';
import { StructuresApiService } from 'libs/data/payfactors-api/structures';
import { UserContext, FeatureAreaConstants, UiPersistenceSettingConstants } from 'libs/models';
import * as fromRootState from 'libs/state/state';
import * as fromPfDataGridActions from 'libs/features/pf-data-grid/actions';
import * as fromPfDataGridReducer from 'libs/features/pf-data-grid/reducers';
import * as fromJobManagementActions from 'libs/features/job-management/actions';

import * as fromJobsPageActions from '../actions';
import * as fromJobsReducer from '../reducers';
import { PageViewIds } from '../constants';
import { DataGridToDataViewsHelper } from 'libs/features/pf-data-grid/helpers';
import { DataViewEntity, ViewField, PagingOptions } from 'libs/models/payfactors-api';
import { SortDescriptor } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';

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
    private pricingApiService: PricingApiService,
    private pricingLegacyApiService: PricingLegacyApiService,
    private payMarketApiService: PayMarketApiService,
    private structureApiService: StructuresApiService,
    private dataViewApiService: DataViewApiService,
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
            new fromPfDataGridActions.ClearSelections(PageViewIds.PricingDetails),
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
  deletePricing$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobsPageActions.DELETING_PRICING),
    switchMap((action: any) => {
      return this.pricingApiService.deletePricing(action.payload).pipe(
        mergeMap(() => [
          new fromJobsPageActions.DeletingPricingSuccess(),
          new fromPfDataGridActions.LoadData(PageViewIds.PricingHistory)
        ]),
        catchError(error => of(new fromJobsPageActions.DeletingPricingError(error)))
      );
    })
  );

  @Effect()
  deletePricingMatch$: Observable<Action> = this.actions$.pipe(
    ofType<fromJobsPageActions.DeletingPricingMatch>(fromJobsPageActions.DELETING_PRICING_MATCH),
    mergeMap((a: fromJobsPageActions.DeletingPricingMatch) =>
      of(a).pipe(
        withLatestFrom(
          this.store.pipe(select(fromRootState.getUserContext)),
          this.store.pipe(select(fromPfDataGridReducer.getBaseEntity, PageViewIds.PricingDetails)),
          this.store.pipe(select(fromPfDataGridReducer.getFields, PageViewIds.PricingDetails)),
          this.store.pipe(select(fromPfDataGridReducer.getPagingOptions, PageViewIds.PricingDetails)),
          this.store.pipe(select(fromPfDataGridReducer.getSortDescriptor, PageViewIds.PricingDetails)),
          this.store.pipe(select(fromPfDataGridReducer.getApplyDefaultFilters, PageViewIds.PricingDetails)),
          this.store.pipe(select(fromPfDataGridReducer.getData, PageViewIds.PricingDetails)),
          (action: fromJobsPageActions.DeletingPricingMatch,
            userContext: UserContext,
            baseEntity: DataViewEntity,
            fields: ViewField[],
            pagingOptions: PagingOptions,
            sortDescriptor: SortDescriptor[],
            applyDefaultFilters: boolean,
            prcingData: GridDataResult
          ) => ({ action, userContext, baseEntity, fields, pagingOptions, sortDescriptor, applyDefaultFilters, prcingData })
        ))),
    switchMap((data) =>
      this.pricingApiService.deletePricingMatch(data.action.pricingMatchId)
        .pipe(
          concatMap(() => this.pricingLegacyApiService.getCalculatePricing(data.userContext.CompanyId)),
          concatMap(() => this.dataViewApiService.getData(DataGridToDataViewsHelper.buildDataViewDataRequest(
            data.baseEntity.Id,
            data.fields,
            [...DataGridToDataViewsHelper.mapFieldsToFiltersUseValuesProperty(data.fields), data.action.pricingToRecalculateFilter],
            { From: 0, Count: 1 },
            data.sortDescriptor,
            false,
            false
          ))))
        .pipe(
          mergeMap((response) => {
            const pricingRowIndex = data.prcingData.data.findIndex(o => o.CompanyJobs_Pricings_CompanyJobPricing_ID === data.action.pricingId);
            return [
              new fromPfDataGridActions.UpdateRow(PageViewIds.PricingDetails, pricingRowIndex, response[0]),
              new fromPfDataGridActions.LoadData(`${PageViewIds.PricingMatches}_${data.action.pricingId}`),
              new fromJobsPageActions.DeletingPricingMatchSuccess(),
            ];
          }),
          catchError(error => of(new fromJobsPageActions.DeletingPricingMatchError(error)))
        )
    ));

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

  private handleError(message: string, title: string = 'Error', resultingAction: Action = new fromJobsPageActions.HandleApiError(message)): Observable<Action> {
    const toastContent = `
    <div class="message-container"><div class="alert-triangle-icon mr-3"></div>${message}</div>`;
    this.toastr.error(toastContent, title, this.toastrOverrides);
    return of(resultingAction);
  }
}

