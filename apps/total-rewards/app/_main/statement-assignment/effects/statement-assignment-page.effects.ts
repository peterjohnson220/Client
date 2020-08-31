import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, mergeMap, catchError, withLatestFrom, concatMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { UserProfileApiService } from 'libs/data/payfactors-api/user';
import { ListAreaColumnResponse } from 'libs/models/payfactors-api/user-profile/response';
import { ExportAssignedEmployeesRequest } from 'libs/models/payfactors-api/total-rewards/request';
import { MappingHelper } from 'libs/core/helpers';
import { TotalRewardsApiService, TotalRewardsAssignmentApiService, TotalRewardsPdfGenerationService } from 'libs/data/payfactors-api/total-rewards';

import { Statement } from '../../../shared/models';
import { GenerateStatementsRequest } from '../models';
import * as fromStatementAssignmentPageActions from '../actions/statement-assignment.page.actions';
import * as fromAssignedEmployeesGridActions from '../actions/assigned-employees-grid.actions';
import * as fromTotalRewardsReducer from '../reducers';

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
            const listAreaColumns =  MappingHelper.mapListAreaColumnResponseListToListAreaColumnList(response);
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
        GenerateByQuery: (data.companyEmployeeIds && data.companyEmployeeIds.length) ? null : data.gridState
      } as GenerateStatementsRequest)),
      switchMap(request =>
        this.totalRewardsPdfGenerationService.generateStatements(request).pipe(
          mergeMap((response) => [
            new fromStatementAssignmentPageActions.GenerateStatementsSuccess({ eventId: response }),
            new fromStatementAssignmentPageActions.CloseGenerateStatementModal(),
            new fromAssignedEmployeesGridActions.ClearSelections()
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
          mergeMap(() => [
            new fromStatementAssignmentPageActions.UnassignEmployeesSuccess(),
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

  constructor(
    private actions$: Actions,
    private totalRewardsApi: TotalRewardsApiService,
    private totalRewardsAssignmentApi: TotalRewardsAssignmentApiService,
    private totalRewardsPdfGenerationService: TotalRewardsPdfGenerationService,
    private userProfileApiService: UserProfileApiService,
    private store: Store<fromTotalRewardsReducer.State>) {}
}
