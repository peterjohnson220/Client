import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';

import { catchError, map, mergeMap, switchMap, withLatestFrom, concatMap, groupBy } from 'rxjs/operators';
import { Observable, of, forkJoin } from 'rxjs';

import { ToastrService } from 'ngx-toastr';
import { SortDescriptor } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';

import {
  JobsApiService,
  PayMarketApiService,
  PricingApiService,
  PricingEdmxApiService,
  CompanyJobApiService,
  UiPersistenceSettingsApiService,
  DataViewApiService
} from 'libs/data/payfactors-api';
import { StructuresApiService } from 'libs/data/payfactors-api/structures';
import { FeatureAreaConstants, UiPersistenceSettingConstants } from 'libs/models';
import { DataViewEntity, ViewField, DataViewFieldDataType, PricingUpdateStrategy, UpdatePricingRequest } from 'libs/models/payfactors-api';
import { DataGridToDataViewsHelper } from 'libs/features/pf-data-grid/helpers';
import { DataGridState } from 'libs/features/pf-data-grid/reducers/pf-data-grid.reducer';

import * as fromPfDataGridActions from 'libs/features/pf-data-grid/actions';
import * as fromPfDataGridReducer from 'libs/features/pf-data-grid/reducers';
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
    private pricingEdmxApiService: PricingEdmxApiService,
    private pricingApiService: PricingApiService,
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
  deletePricing$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobsPageActions.DELETING_PRICING),
    switchMap((action: any) => {
      return this.pricingEdmxApiService.deletePricing(action.payload).pipe(
        mergeMap(() => [
          new fromJobsPageActions.DeletingPricingSuccess(),
          new fromPfDataGridActions.LoadData(PageViewIds.PricingHistory),
          new fromPfDataGridActions.LoadData(PageViewIds.PayMarkets)
        ]),
        catchError(error => of(new fromJobsPageActions.DeletingPricingError(error))),
      );
    })
  );

  @Effect()
  deletePricingMatch$: Observable<Action> = this.actions$.pipe(
    ofType<fromJobsPageActions.DeletingPricingMatch>(fromJobsPageActions.DELETING_PRICING_MATCH),
    mergeMap((a: fromJobsPageActions.DeletingPricingMatch) =>
      of(a).pipe(
        withLatestFrom(
          this.store.pipe(select(fromPfDataGridReducer.getBaseEntity, PageViewIds.PayMarkets)),
          this.store.pipe(select(fromPfDataGridReducer.getFields, PageViewIds.PayMarkets)),
          this.store.pipe(select(fromPfDataGridReducer.getSortDescriptor, PageViewIds.PayMarkets)),
          this.store.pipe(select(fromPfDataGridReducer.getData, PageViewIds.PayMarkets)),
          (action: fromJobsPageActions.DeletingPricingMatch,
            baseEntity: DataViewEntity,
            fields: ViewField[],
            sortDescriptor: SortDescriptor[],
            currentPaymarketsData: GridDataResult
          ) => ({ action, baseEntity, fields, sortDescriptor, currentPaymarketsData })
        ))),
    switchMap((data) =>
      this.pricingApiService.deletePricingMatch(data.action.pricingMatchId)
        .pipe(concatMap((modifiedPricingsIds) => {
          const idsForModifiedVisiblePricings = data.currentPaymarketsData.data
            .filter(x => modifiedPricingsIds.includes(x.CompanyJobs_Pricings_CompanyJobPricing_ID))
            .map(x => x.CompanyJobs_Pricings_CompanyJobPricing_ID);
          return this.getModifiedDataRows(
            idsForModifiedVisiblePricings, 'CompanyJobs_Pricings', 'CompanyJobPricing_ID',
            data.baseEntity.Id, data.fields, data.sortDescriptor);
        }))
        .pipe(
          mergeMap((updatedPricingData) => {
            const updatePricingsActions = this.getActionsToUpdateRows(updatedPricingData, data.currentPaymarketsData,
              'CompanyJobs_Pricings_CompanyJobPricing_ID', PageViewIds.PayMarkets, true);
            const updateMatchesActions = this.getActionsToReloadPricingMatches(updatedPricingData, data.currentPaymarketsData);

            const actions = updatePricingsActions.concat(updateMatchesActions);
            actions.push(new fromJobsPageActions.DeletingPricingMatchSuccess());
            return actions;
          }),
          catchError(error => of(new fromJobsPageActions.DeletingPricingMatchError(error)))
        )
    ));

  @Effect()
  updatePricingMatch$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobsPageActions.UPDATING_PRICING_MATCH),
    groupBy((action: fromJobsPageActions.UpdatingPricingMatch) => action.pricingId),
    mergeMap(pricingIdGroup => pricingIdGroup.pipe(
      mergeMap((a: fromJobsPageActions.UpdatingPricingMatch) =>
        of(a).pipe(
          withLatestFrom(
            this.store.pipe(select(fromPfDataGridReducer.getGrid, a.matchesGridPageViewId)),
            this.store.pipe(select(fromPfDataGridReducer.getGrid, PageViewIds.PayMarkets)),
            (action: fromJobsPageActions.UpdatingPricingMatch,
              modifiedMatchGridState: DataGridState,
              paymarketsGridState: DataGridState
            ) => ({ action, modifiedMatchGridState, paymarketsGridState })
          ))),
      switchMap((data) =>
        this.getUpdatePricingMatchStrategy(data.action, data.modifiedMatchGridState, data.paymarketsGridState)
          .pipe(
            mergeMap((updatedRowData) => {
              return this.getUpdatePricingMatchActions(data.action, data.modifiedMatchGridState, data.paymarketsGridState, updatedRowData);
            }),
            catchError(error => of(new fromJobsPageActions.UpdatingPricingMatchError(error)))
          )
      )))
  );

  @Effect()
  updatePricing$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobsPageActions.UPDATING_PRICING),
    groupBy((action: fromJobsPageActions.UpdatingPricing) => action.request.PricingId),
    mergeMap(pricingIdGroup => pricingIdGroup.pipe(
      mergeMap((a: fromJobsPageActions.UpdatingPricing) =>
        of(a).pipe(
          withLatestFrom(
            this.store.pipe(select(fromPfDataGridReducer.getGrid, PageViewIds.PayMarkets)),
            (action: fromJobsPageActions.UpdatingPricing, paymarketsGridState: DataGridState) => ({ action, paymarketsGridState })
          ))),
      switchMap((data) =>
        this.getUpdatePricingStrategy(data.action, data.paymarketsGridState)
          .pipe(
            mergeMap((updatedRowData) => {
              return this.getUpdatePricingActions(data.action, data.paymarketsGridState, updatedRowData);
            }),
            catchError(error => of(new fromJobsPageActions.UpdatingPricingError(error)))
          )
      )))
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

  //#region UpdatePricing Strategies

  private getUpdatePricingStrategy(
    action: fromJobsPageActions.UpdatingPricing,
    paymarketsGridState: DataGridState): Observable<any> {
    return this.pricingApiService.updatePricing(action.request)
      .pipe(concatMap((modifiedPricingsIds) => {
        if (action.request.UpdateRelatedPricings) {
          modifiedPricingsIds = modifiedPricingsIds.filter(x => x !== action.request.PricingId);
        }
        const idsForModifiedVisiblePricings = paymarketsGridState.data.data
          .filter(x => modifiedPricingsIds.includes(x.CompanyJobs_Pricings_CompanyJobPricing_ID))
          .map(x => x.CompanyJobs_Pricings_CompanyJobPricing_ID);

        return idsForModifiedVisiblePricings.length
          ? this.getModifiedDataRows(idsForModifiedVisiblePricings, 'CompanyJobs_Pricings', 'CompanyJobPricing_ID',
            paymarketsGridState.baseEntity.Id, paymarketsGridState.fields, paymarketsGridState.sortDescriptor)
          : of([]);
      }));
  }

  private getUpdatePricingActions(action: fromJobsPageActions.UpdatingPricing, paymarketsGridState: DataGridState, updatedRowData: any[]): Action[] {
    let actions = [];

    if (updatedRowData.length) {
      actions = actions.concat(this.getActionsToUpdateRows(updatedRowData, paymarketsGridState.data,
        'CompanyJobs_Pricings_CompanyJobPricing_ID', PageViewIds.PayMarkets));
    }
    if (action.request.UpdateRelatedPricings) {
      actions.push(new fromJobsPageActions.UpdatingPricingSuccess());
    } else {
      const request = { ...action.request, UpdateRelatedPricings: true };
      actions.push(new fromJobsPageActions.UpdatingPricing(request, PageViewIds.PayMarkets));
    }
    return actions;
  }

  //#region UpdatePricingMatch Strategies

  private getUpdatePricingMatchStrategy(
    action: fromJobsPageActions.UpdatingPricingMatch,
    modifiedMatchGridState: DataGridState,
    paymarketsGridState: DataGridState): Observable<[any, any]> {
    return this.pricingApiService.updatePricingMatch(action.request)
      .pipe(concatMap((modifiedPricingsIds) => {
        const idsForModifiedVisiblePricings = paymarketsGridState.data.data
          .filter(x => modifiedPricingsIds.includes(x.CompanyJobs_Pricings_CompanyJobPricing_ID))
          .map(x => x.CompanyJobs_Pricings_CompanyJobPricing_ID);
        return this.getDataForModifiedRows(action, modifiedMatchGridState, paymarketsGridState, modifiedPricingsIds, idsForModifiedVisiblePricings);
      }));
  }

  private getDataForModifiedRows(
    action: fromJobsPageActions.UpdatingPricingMatch,
    modifiedMatchGridState: DataGridState,
    paymarketsGridState: DataGridState,
    modifiedPricingsIds: any,
    idsForModifiedVisiblePricings: any[]): Observable<[any, any]> {

    if (action.request.PricingUpdateStrategy === PricingUpdateStrategy.LinkedSlotted) {
      const result = forkJoin(
        modifiedPricingsIds?.length
          ? this.getModifiedDataRows(idsForModifiedVisiblePricings, 'CompanyJobs_Pricings', 'CompanyJobPricing_ID',
            paymarketsGridState.baseEntity.Id, paymarketsGridState.fields, paymarketsGridState.sortDescriptor)
          : of([]),
        of(modifiedPricingsIds));
      return result;
    } else {
      return forkJoin(
        this.getModifiedDataRows(idsForModifiedVisiblePricings, 'CompanyJobs_Pricings', 'CompanyJobPricing_ID',
          paymarketsGridState.baseEntity.Id, paymarketsGridState.fields, paymarketsGridState.sortDescriptor),
        this.getModifiedDataRows([action.request.MatchId], 'CompanyJobs_PricingsMatches', 'CompanyJobPricingMatch_ID',
          modifiedMatchGridState.baseEntity.Id, modifiedMatchGridState.fields, modifiedMatchGridState.sortDescriptor)
      );
    }
  }

  private getModifiedDataRows(
    modifiedIds: number[], filterEntity: string, filterField: string, baseEntityId: number,
    fields: ViewField[], sortDescriptor: SortDescriptor[]): Observable<any> {

    return this.dataViewApiService.getData(DataGridToDataViewsHelper.buildDataViewDataRequest(
      baseEntityId,
      fields,
      [{
        EntitySourceName: filterEntity,
        SourceName: filterField,
        DataType: DataViewFieldDataType.Int,
        Operator: 'in',
        Values: modifiedIds.map(String),
      }],
      { From: 0, Count: modifiedIds.length },
      sortDescriptor,
      false,
      false
    ));
  }

  //#endregion


  //#region UpdatePricing Actions to Dispatch

  private getUpdatePricingMatchActions(action: fromJobsPageActions.UpdatingPricingMatch, modifiedMatchGridState: DataGridState,
    paymarketsGridState: DataGridState, updatedRowData: any): Action[] {

    if (action.request.PricingUpdateStrategy === PricingUpdateStrategy.LinkedSlotted) {
      return this.getUpdatePricingLinkedAndSlottedActions(paymarketsGridState, updatedRowData);
    } else {
      return this.getUpdatePricingParentActions(action, modifiedMatchGridState, paymarketsGridState, updatedRowData);
    }
  }

  private getUpdatePricingParentActions(
    action: fromJobsPageActions.UpdatingPricingMatch,
    modifiedMatchGridState: DataGridState,
    paymarketsGridState: DataGridState, updatedRowData: any) {

    const excludedParentPricingId = action.request.PricingUpdateStrategy === PricingUpdateStrategy.LinkedSlotted
      ? null
      : action.pricingId;

    const updatedPricingData = updatedRowData[0];
    const updatedMatchesData = updatedRowData[1];
    const updateMatchAction = this.getActionsToUpdateRows(updatedMatchesData, modifiedMatchGridState.data,
      'CompanyJobs_PricingsMatches_CompanyJobPricingMatch_ID', action.matchesGridPageViewId, true);
    const updatePricingsActions = this.getActionsToUpdateRows(updatedPricingData, paymarketsGridState.data,
      'CompanyJobs_Pricings_CompanyJobPricing_ID', PageViewIds.PayMarkets);
    const reloadPricingMatchesGridsActions = this.getActionsToReloadPricingMatches(updatedPricingData,
      paymarketsGridState.data, excludedParentPricingId);

    const actions = updateMatchAction.concat(updateMatchAction, updatePricingsActions, reloadPricingMatchesGridsActions);
    actions.push(new fromJobsPageActions.UpdatingPricingMatchSuccess());

    if (action.request.PricingUpdateStrategy === PricingUpdateStrategy.Parent) {
      const updateLinkedRequest = {
        ...action.request,
        PricingUpdateStrategy: PricingUpdateStrategy.LinkedSlotted
      };
      actions.push(new fromJobsPageActions.UpdatingPricingMatch(updateLinkedRequest, action.pricingId, null));
    }

    return actions;
  }

  private getUpdatePricingLinkedAndSlottedActions(paymarketsGridState: DataGridState, modifiedRowsData: any) {

    const updatedPricingData = modifiedRowsData[0];
    const modifiedPricingsIds = modifiedRowsData[1];

    let actions = [];
    if (modifiedPricingsIds?.length) {
      const updatePricingsActions = this.getActionsToUpdateRows(updatedPricingData, paymarketsGridState.data,
        'CompanyJobs_Pricings_CompanyJobPricing_ID', PageViewIds.PayMarkets);
      const reloadPricingMatchesGridsActions = this.getActionsToReloadPricingMatches(updatedPricingData, paymarketsGridState.data);
      actions = actions.concat(updatePricingsActions, reloadPricingMatchesGridsActions);
    }

    actions.push(new fromJobsPageActions.UpdatingPricingMatchSuccess());

    return actions;
  }

  private getActionsToUpdateRows(updatedData: any[], currentData: GridDataResult,
    fieldId: string, pageViewId: string, resortGrid: boolean = false): any[] {
    const actions = [];
    updatedData.forEach(modifiedRow => {
      const recordRowIndex = currentData.data.findIndex(o => o[fieldId] === modifiedRow[fieldId]);

      if (resortGrid) {
        actions.push(new fromPfDataGridActions.UpdateRow(pageViewId, recordRowIndex, modifiedRow, null, true));
      } else {
        actions.push(new fromPfDataGridActions.UpdateGridDataRow(pageViewId, recordRowIndex, modifiedRow));
      }
    });
    return actions;
  }

  private getActionsToReloadPricingMatches(updatedPricingData: any[], currentPaymarketsData: GridDataResult, excludeParentPricingId: number = null): any[] {
    const actions = [];
    updatedPricingData.forEach(modifiedPricing => {
      if (modifiedPricing.CompanyJobs_Pricings_CompanyJobPricing_ID !== excludeParentPricingId) {
        const pricingRowIndex = currentPaymarketsData.data.findIndex(
          o => o.CompanyJobs_Pricings_CompanyJobPricing_ID === modifiedPricing.CompanyJobs_Pricings_CompanyJobPricing_ID);
        actions.push(new fromPfDataGridActions.LoadData(`${PageViewIds.PricingMatches}_${modifiedPricing.CompanyJobs_Pricings_CompanyJobPricing_ID}`));
      }
    });
    return actions;
  }
  //#endregion

}

