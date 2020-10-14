import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, mergeMap, catchError, withLatestFrom, concatMap, delay } from 'rxjs/operators';
import { of } from 'rxjs';

import { UserProfileApiService } from 'libs/data/payfactors-api/user';
import { ListAreaColumnResponse } from 'libs/models/payfactors-api/user-profile/response';
import { ExportAssignedEmployeesRequest } from 'libs/models/payfactors-api/total-rewards/request';
import { MappingHelper } from 'libs/core/helpers';
import { TotalRewardsApiService, TotalRewardsAssignmentApiService, TotalRewardsPdfGenerationService } from 'libs/data/payfactors-api/total-rewards';
import { Statement } from 'libs/features/total-rewards/total-rewards-statement/models';
import { TrsConstants } from 'libs/features/total-rewards/total-rewards-statement/constants/trs-constants';
import { AbstractFeatureFlagService, FeatureFlags } from 'libs/core/services';
import { SaveListAreaColumnsRequest } from 'libs/models/payfactors-api/user-profile/request';
import * as fromGridActions from 'libs/core/actions/grid.actions';
import * as fromEmployeeManagementActions from 'libs/features/employee-management/actions';
import { GridTypeEnum } from 'libs/models/common';

import * as fromStatementAssignmentPageActions from '../actions/statement-assignment.page.actions';
import * as fromAssignedEmployeesGridActions from '../actions/assigned-employees-grid.actions';
import * as fromTotalRewardsReducer from '../reducers';
import { AssignedEmployeesGridHelper } from '../models';

@Injectable()
export class StatementAssignmentPageEffects {

  @Effect()
  loadStatement$ = this.actions$
    .pipe(
      ofType(fromStatementAssignmentPageActions.LOAD_STATEMENT),
      switchMap((action: fromStatementAssignmentPageActions.LoadStatement) =>
        this.totalRewardsApi.getStatementFromId(action.payload.statementId).pipe(
          map((response: Statement) => new fromStatementAssignmentPageActions.LoadStatementSuccess(response)),
          catchError(error => of(new fromStatementAssignmentPageActions.LoadStatementError(error)))
        )
      )
    );

  @Effect()
  getListAreaColumns$ = this.actions$
    .pipe(
      ofType(fromStatementAssignmentPageActions.LOAD_ASSIGNED_EMPLOYEES_LIST_AREA_COLUMNS),
      switchMap((action: fromStatementAssignmentPageActions.LoadAssignedEmployeesListAreaColumns) =>
        this.userProfileApiService.getListAreaColumns({ ListAreaName: 'TotalRewardsAssignedEmployees', UdfType: null }).pipe(
          map((response: ListAreaColumnResponse[]) => {
            const electronicDeliveryFeatureFlagEnabled = this.featureFlagService.enabled(FeatureFlags.TotalRewardsElectronicDelivery, false);
            let listAreaColumns =  MappingHelper.mapListAreaColumnResponseListToListAreaColumnList(response);
            listAreaColumns = AssignedEmployeesGridHelper.filterGridColumns(listAreaColumns, electronicDeliveryFeatureFlagEnabled);
            return new fromStatementAssignmentPageActions.LoadAssignedEmployeesListAreaColumnsSuccess(listAreaColumns);
          }),
          catchError(response => of(new fromStatementAssignmentPageActions.LoadAssignedEmployeesListAreaColumnsError()))
        )
      ));

  @Effect()
  generateStatements$ = this.actions$
    .pipe(
      ofType(fromStatementAssignmentPageActions.GENERATE_STATEMENTS),
      withLatestFrom(
        this.store.select(fromTotalRewardsReducer.getStatement),
        this.store.select(fromTotalRewardsReducer.getAssignedEmployeesSelectedCompanyEmployeeIds),
        this.store.select(fromTotalRewardsReducer.getAssignedEmployeesGridState),
        (action: fromStatementAssignmentPageActions.GenerateStatements, statement, companyEmployeeIds, gridState) =>
          ({ action, companyEmployeeIds, statementId: statement.StatementId, gridState })
      ),
      map(data => ({
        StatementId: data.statementId,
        CompanyEmployeeIds: data.companyEmployeeIds,
        GenerateByQuery: (data.companyEmployeeIds && data.companyEmployeeIds.length) ? null : data.gridState,
        WaitForPdfGenerationSelector: TrsConstants.READY_FOR_PDF_GENERATION_SELECTOR,
        Method: data.action.payload
      })),
      switchMap(request =>
        this.totalRewardsPdfGenerationService.generateStatements(request).pipe(
          mergeMap((response) => [
            new fromStatementAssignmentPageActions.GenerateStatementsSuccess({ eventId: response }),
            new fromStatementAssignmentPageActions.CloseGenerateStatementModal(),
            new fromAssignedEmployeesGridActions.ClearSelections(),
            new fromStatementAssignmentPageActions.UpdateStatementIsGenerating(true)
          ]),
          catchError(error => of(new fromStatementAssignmentPageActions.GenerateStatementsError(error)))
        )
      )
    );

  @Effect()
  unassignEmployees$ = this.actions$
    .pipe(
      ofType(fromStatementAssignmentPageActions.UNASSIGN_EMPLOYEES),
      withLatestFrom(
        this.store.select(fromTotalRewardsReducer.getStatement),
        this.store.select(fromTotalRewardsReducer.getAssignedEmployeesSelectedCompanyEmployeeIds),
        this.store.select(fromTotalRewardsReducer.getIsSingleEmployeeAction),
        this.store.select(fromTotalRewardsReducer.getOpenActionMenuEmployee),
        this.store.select(fromTotalRewardsReducer.getAssignedEmployeesGridState),
        (action: fromStatementAssignmentPageActions.GenerateStatements, statement, companyEmployeeIds, isSingleAction, actionMenuEmployee, gridState) =>
          ({ action, companyEmployeeIds, statementId: statement.StatementId, isSingleAction, actionMenuEmployee, gridState })
      ),
      concatMap((data) =>
        this.totalRewardsAssignmentApi.unassignEmployees(
          {
            statementId: data.statementId,
            CompanyEmployeeIds: (data.isSingleAction ? [data.actionMenuEmployee.CompanyEmployeeId] : data.companyEmployeeIds)
          }).pipe(
          mergeMap((response) => [
            new fromStatementAssignmentPageActions.UnassignEmployeesSuccess(response),
            new fromAssignedEmployeesGridActions.ClearSelections(),
            new fromStatementAssignmentPageActions.CloseUnassignModal(),
            new fromAssignedEmployeesGridActions.LoadAssignedEmployees({...data.gridState, skip: 0})
          ]),
          catchError(() => of(new fromStatementAssignmentPageActions.UnassignEmployeesError()))
        )
      )
    );

  @Effect()
  exportAssignedEmployees$ = this.actions$.pipe(
    ofType(fromStatementAssignmentPageActions.START_EXPORT_ASSIGNED_EMPLOYEES),
    withLatestFrom(
      this.store.select(fromTotalRewardsReducer.getStatement),
      this.store.select(fromTotalRewardsReducer.getAssignedEmployeesSelectedCompanyEmployeeIds),
      this.store.select(fromTotalRewardsReducer.getEmployeeSearchTerm),
      this.store.select(fromTotalRewardsReducer.getAssignedEmployeesGridState),
      (action: fromStatementAssignmentPageActions.ExportAssignedEmployees, statement, selectedEmployees, searchTerm, gridState) =>
        ({ statementId: statement.StatementId, selectedEmployees, searchTerm, gridState })
    ),
    switchMap(data => {
      const request: ExportAssignedEmployeesRequest = {
        StatementId: data.statementId,
        EmployeeIds: data.selectedEmployees,
        EmployeeSearchTerm: data.searchTerm,
        GridListState: data.gridState
      };
      return this.totalRewardsAssignmentApi.exportAssignedEmployees(request).pipe(
        map((response: string) => new fromStatementAssignmentPageActions.ExportAssignedEmployeesSuccess(response)),
        catchError(() => of(new fromStatementAssignmentPageActions.ExportAssignedEmployeesError()))
      );
    })
  );

  @Effect()
  getExportingAssignedEmployees$ = this.actions$
    .pipe(
      ofType(fromStatementAssignmentPageActions.GET_EXPORTING_ASSIGNED_EMPLOYEES),
      switchMap((action: fromStatementAssignmentPageActions.GetExportingAssignedEmployee) =>
        this.totalRewardsAssignmentApi.getRunningExport().pipe(
          map((response: string) => new fromStatementAssignmentPageActions.GetExportingAssignedEmployeeSuccess(response)),
          catchError(error => of(new fromStatementAssignmentPageActions.GetExportingAssignedEmployeeError()))
        )
      )
    );

  @Effect()
  saveListAreaColumns$ = this.actions$
    .pipe(
      ofType(fromStatementAssignmentPageActions.SAVE_GRID_COLUMNS),
      switchMap((action: fromStatementAssignmentPageActions.SaveGridColumns) => {
        const request: SaveListAreaColumnsRequest = {
          Columns: MappingHelper.mapListAreaColumnListToListAreaColumnRequestList(action.payload)
        };
        return this.userProfileApiService.saveListAreaColumns(request)
          .pipe(
            map((response) => new fromStatementAssignmentPageActions.SaveGridColumnsSuccess(action.payload)),
            catchError(() => of(new fromStatementAssignmentPageActions.SaveGridColumnsError()))
          );
      })
    );

  @Effect()
  saveGridColumnsSuccess$ = this.actions$
    .pipe(
      ofType(fromStatementAssignmentPageActions.SAVE_GRID_COLUMNS_SUCCESS),
      withLatestFrom(
        this.store.select(fromTotalRewardsReducer.getAssignedEmployeesGridState),
        (action: fromStatementAssignmentPageActions.SaveGridColumnsSuccess, gridState) => ({ action, gridState })
      ),
      map((data) => new fromAssignedEmployeesGridActions.LoadAssignedEmployees(data.gridState))
    );

  @Effect()
  saveEmpoyeeSuccess$ = this.actions$
    .pipe(
      ofType(fromEmployeeManagementActions.SAVE_EMPLOYEE_SUCCESS),
      delay(1800),
      withLatestFrom(
        this.store.select(fromTotalRewardsReducer.getAssignedEmployeesGridState),
        (action: fromEmployeeManagementActions.SaveEmployeeSuccess, gridState) => ({action, gridState})
      ),
      mergeMap((data) => [
          new fromGridActions.UpdateGrid(GridTypeEnum.TotalRewardsAssignedEmployees, data.gridState),
          new fromAssignedEmployeesGridActions.LoadAssignedEmployees(data.gridState)
      ]),
    );

  constructor(
    private actions$: Actions,
    private totalRewardsApi: TotalRewardsApiService,
    private totalRewardsAssignmentApi: TotalRewardsAssignmentApiService,
    private totalRewardsPdfGenerationService: TotalRewardsPdfGenerationService,
    private userProfileApiService: UserProfileApiService,
    private store: Store<fromTotalRewardsReducer.State>,
    private featureFlagService: AbstractFeatureFlagService
  ) {}
}
