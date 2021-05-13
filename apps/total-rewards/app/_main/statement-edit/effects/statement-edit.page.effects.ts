import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, switchMap, map, withLatestFrom, mapTo, concatMap, debounceTime, mergeMap } from 'rxjs/operators';
import { Store, Action, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { TotalRewardsApiService, TotalRewardsPdfGenerationService, TotalRewardsSearchApiService } from 'libs/data/payfactors-api/total-rewards';
import { EmployeeRewardsDataRequest, TotalRewardsEmployeeSearchResponse } from 'libs/models/payfactors-api/total-rewards';
import { CompanyEmployeeApiService } from 'libs/data/payfactors-api/company';
import { PfConstants } from 'libs/models/common';
import { TotalRewardsAssignmentService } from 'libs/features/total-rewards/total-rewards-statement/services/total-rewards-assignment.service';
import { Statement, Settings } from 'libs/features/total-rewards/total-rewards-statement/models';
import { SaveSettingsRequest } from 'libs/features/total-rewards/total-rewards-statement/models/request-models';
import { EmployeeRewardsDataService } from 'libs/features/total-rewards/total-rewards-statement/services/employee-rewards-data.service';
import { TotalRewardsStatementService } from 'libs/features/total-rewards/total-rewards-statement/services/total-rewards-statement.service';
import { TrsConstants } from 'libs/features/total-rewards/total-rewards-statement/constants/trs-constants';
import { DeliveryMethod } from 'libs/features/total-rewards/total-rewards-statement/models/delivery-method';

import * as fromTotalRewardsReducer from '../reducers';
import * as fromStatementEditActions from '../actions';
import { SaveStatement, SaveSettings, PrepareSaveSettings } from '../actions';

@Injectable()
export class StatementEditPageEffects {

  @Effect()
  generateStatementPreview$ = this.actions$
    .pipe(
      ofType(fromStatementEditActions.GENERATE_STATEMENT_PREVIEW),
      withLatestFrom(
        this.store.select(fromTotalRewardsReducer.selectStatement),
        this.store.select(fromTotalRewardsReducer.getEmployeeData),
        (action: fromStatementEditActions.GenerateStatementPreview, statement, employeeData) =>
          ({ action, companyEmployeeId : employeeData.obj.CompanyEmployeeId, statementId: statement.StatementId })
      ),
      map(data => ({
        StatementId: data.statementId,
        UseMockEmployeeRewardsData: !data.companyEmployeeId,
        IncludeEmployeeNameInGeneratedFileName: true,
        CompanyEmployeeIds: data.companyEmployeeId ? [data.companyEmployeeId] : [],
        EmployeeSearchTerm: '',
        ExpectedEmployeeCount: data.companyEmployeeId ? 1 : 0,
        GenerateByQuery: null,
        WaitForPdfGenerationSelector: TrsConstants.READY_FOR_PDF_GENERATION_SELECTOR,
        Method: DeliveryMethod.PDFExport,
        EmailTemplate: null
      })),
      switchMap(request =>
        this.totalRewardsPdfGenerationService.generateStatements(request).pipe(
          map((response: string) => new fromStatementEditActions.GenerateStatementPreviewSuccess(response)),
          catchError(error => of(new fromStatementEditActions.GenerateStatementPreviewError(error)))
        )
      )
    );

  @Effect()
  getStatement$: Observable<Action> =
    this.actions$.pipe(
      ofType(fromStatementEditActions.LOAD_STATEMENT),
      switchMap((action: fromStatementEditActions.LoadStatement) =>
        this.totalRewardsApiService.getStatementFromId(action.payload).pipe(
          mergeMap((response: Statement) => {
            const actions = [];
            actions.push(new fromStatementEditActions.LoadStatementSuccess(response));
            actions.push(new fromStatementEditActions.GetCompanyUDF());
            return actions;
          }),
          catchError(error => of(new fromStatementEditActions.LoadStatementError(error)))
        ))
    );

  @Effect()
  statementChange$: Observable<Action> =
    this.actions$.pipe(
      ofType(
        fromStatementEditActions.UPDATE_STATEMENT_NAME,
        fromStatementEditActions.UPDATE_STATEMENT_CONTROL_TITLE,
        fromStatementEditActions.UPDATE_CALCULATION_CONTROL_FIELD_TITLE,
        fromStatementEditActions.UPDATE_CALCULATION_CONTROL_SUMMARY_TITLE,
        fromStatementEditActions.REMOVE_CALCULATION_CONTROL_COMPENSATION_FIELD,
        fromStatementEditActions.REORDER_CALCULATION_CONTROL_COMPENSATION_FIELD,
        fromStatementEditActions.ADD_CALCULATION_CONTROL_COMPENSATION_FIELD,
        fromStatementEditActions.UPDATE_RICH_TEXT_CONTROL_CONTENT,
        fromStatementEditActions.SAVE_IMAGE_CONTROL_IMAGE,
        fromStatementEditActions.UPDATE_EFFECTIVE_DATE
      ),
      mapTo(new SaveStatement())
    );

  @Effect()
  saveStatement$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromStatementEditActions.SAVE_STATEMENT),
      withLatestFrom(this.store.pipe(select(fromTotalRewardsReducer.selectStatement)),
        (action, statement) => ({action, statement})),
      concatMap((data) =>
        this.totalRewardsApiService.saveStatement(TotalRewardsStatementService.parseStatementEffectiveDateToString(data.statement)).pipe(
          map((statement: Statement) => new fromStatementEditActions.SaveStatementSuccess(statement)),
          catchError(error => of(new fromStatementEditActions.SaveStatementError(error)))
        ))
    );

  @Effect()
  settingsChange$: Observable<Action> =
    this.actions$.pipe(
      ofType(
        fromStatementEditActions.UPDATE_SETTINGS_FONT_SIZE,
        fromStatementEditActions.UPDATE_SETTINGS_FONT_FAMILY,
        fromStatementEditActions.UPDATE_SETTINGS_COLOR,
        fromStatementEditActions.TOGGLE_DISPLAY_SETTING,
        fromStatementEditActions.UPDATE_ADDITIONAL_PAGE_SETTINGS
      ),
      mapTo(new PrepareSaveSettings())
    );

  @Effect()
  prepareSettingsSave$: Observable<Action> =
    this.actions$.pipe(
      ofType(fromStatementEditActions.PREPARE_SAVE_SETTINGS),
      mapTo(new SaveSettings())
    );

  @Effect()
  saveSettings$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromStatementEditActions.SAVE_SETTINGS),
      withLatestFrom(
        this.store.pipe(select(fromTotalRewardsReducer.selectStatement)),
        this.store.pipe(select(fromTotalRewardsReducer.getRepeatableHeaderHeightInPixels)),
        (action, statement: Statement, headerHeightInPixels: number) => ({ ...statement, headerHeightInPixels })),
      map(combined => ({ StatementId: combined.StatementId, HeaderHeightInPixels: combined.headerHeightInPixels, ...combined.Settings })),
      concatMap((saveSettingsRequest: SaveSettingsRequest) =>
        this.totalRewardsApiService.saveStatementSettings(saveSettingsRequest).pipe(
          map((updatedStatement: Statement) => {
            return updatedStatement.EffectiveDate ? { ...updatedStatement, EffectiveDate: new Date(updatedStatement.EffectiveDate) } : updatedStatement;
          }),
          mergeMap((updatedStatement: Statement) => [
            new fromStatementEditActions.SaveStatementSuccess(updatedStatement),
            new fromStatementEditActions.SaveSettingsSuccess(updatedStatement.Settings),
          ]),
          catchError(() => of(new fromStatementEditActions.SaveSettingsError()))
        ))
    );

  @Effect()
  resetSettings$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromStatementEditActions.RESET_SETTINGS),
      withLatestFrom(
        this.store.pipe(select(fromTotalRewardsReducer.selectStatement)),
        (action, statement: Statement) => statement),
      concatMap((statement: Statement) =>
        this.totalRewardsApiService.resetStatementSettings(statement.StatementId).pipe(
          map((updatedStatement: Statement) => {
            return updatedStatement.EffectiveDate ? { ...updatedStatement, EffectiveDate: new Date(updatedStatement.EffectiveDate) } : updatedStatement;
          }),
          mergeMap((updatedStatement: Statement) => [
            new fromStatementEditActions.SaveStatementSuccess(updatedStatement),
            new fromStatementEditActions.SaveSettingsSuccess(updatedStatement.Settings),
          ]),
          catchError(() => of(new fromStatementEditActions.SaveSettingsError()))
        ))
    );

  @Effect()
  removeImage$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromStatementEditActions.REMOVE_IMAGE_CONTROL_IMAGE),
      switchMap((action: fromStatementEditActions.RemoveImageControlImage) =>
        this.totalRewardsApiService.deleteStatementImage(action.payload.FileName).pipe(
          mapTo(new SaveStatement())
        )
      )
    );

  @Effect()
  searchAssignedEmployees$ = this.actions$
    .pipe(
      ofType(fromStatementEditActions.SEARCH_ASSIGNED_EMPLOYEES),
      debounceTime(PfConstants.DEBOUNCE_DELAY),
      switchMap((action: fromStatementEditActions.SearchAssignedEmployees) => {
        const request = {
          StatementId: action.payload.statementId,
          Filters: [],
          FilterOptions: {
            ReturnFilters: false,
            AggregateCount: 10
          },
          SearchFields: [{
            Name: 'fullname_search',
            Value: action.payload.searchTerm
          }],
          PagingOptions: { From: 0, Count: 25 }
        };
        return this.totalRewardsSearchApiService.searchEmployees(request)
          .pipe(
            map((response: TotalRewardsEmployeeSearchResponse) => {
              const employeeSearchResults = TotalRewardsAssignmentService.mapSearchResults(response.EmployeeResults);
              return new fromStatementEditActions.SearchAssignedEmployeesSuccess(employeeSearchResults);
            }),
            catchError(() => of(new fromStatementEditActions.SearchAssignedEmployeesError()))
          );
      })
    );

  @Effect()
  getBenefits$ = this.actions$
    .pipe(
      ofType(fromStatementEditActions.GET_EMPLOYEE_REWARDS_DATA),
      switchMap((action: fromStatementEditActions.GetEmployeeRewardsData) => {
        const request: EmployeeRewardsDataRequest = {
          CompanyEmployeeId: action.payload.companyEmployeeId,
          StatementId: action.payload.statementId
        };
        return this.companyEmployeeApiService.getBenefits(request)
          .pipe(
            map(response => new fromStatementEditActions.GetEmployeeRewardsDataSuccess(EmployeeRewardsDataService.mapEmployeeRewardsDataDateFields(response))),
            catchError(() => of(new fromStatementEditActions.GetEmployeeRewardsDataError()))
          );
      })
    );

  @Effect()
  resetEmployeeRewardsData$ = this.actions$
    .pipe(
      ofType(fromStatementEditActions.RESET_EMPLOYEE_REWARDS_DATA),
      switchMap((action: fromStatementEditActions.ResetEmployeeRewardsData) => {
        return this.companyEmployeeApiService.getMockBenefits()
          .pipe(
            map(response => new fromStatementEditActions.GetEmployeeRewardsDataSuccess(EmployeeRewardsDataService.mapEmployeeRewardsDataDateFields(response))),
            catchError(() => of(new fromStatementEditActions.GetEmployeeRewardsDataError()))
          );
      })
    );

  @Effect()
  getCompanyUdf$ = this.actions$
    .pipe(
      ofType(fromStatementEditActions.GET_COMPANY_UDF),
      switchMap((action: fromStatementEditActions.GetCompanyUDF) => {
        return this.totalRewardsApiService.getCompanyUdfs()
          .pipe(
            map((response) => new fromStatementEditActions.GetCompanyUDFSuccess(response)),
            catchError(() => of(new fromStatementEditActions.GetCompanyUDFError()))
        );
      })
    );

  constructor(
    private store: Store<fromTotalRewardsReducer.State>,
    private actions$: Actions,
    private totalRewardsApiService: TotalRewardsApiService,
    private totalRewardsSearchApiService: TotalRewardsSearchApiService,
    private companyEmployeeApiService: CompanyEmployeeApiService,
    private totalRewardsPdfGenerationService: TotalRewardsPdfGenerationService
  ) {}
}
