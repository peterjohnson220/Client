import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, switchMap, map, withLatestFrom, mapTo, concatMap, debounceTime } from 'rxjs/operators';
import { Store, Action, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { TotalRewardsApiService, TotalRewardsSearchApiService } from 'libs/data/payfactors-api/total-rewards';
import { TotalRewardsEmployeeSearchResponse } from 'libs/models/payfactors-api/total-rewards';
import { CompanyEmployeeApiService } from 'libs/data/payfactors-api/company';
import { PfConstants } from 'libs/models/common';
import { TotalRewardsAssignmentService } from 'libs/features/total-rewards/total-rewards-statement/services/total-rewards-assignment.service';
import { Statement, Settings } from 'libs/features/total-rewards/total-rewards-statement/models';
import { SaveSettingsRequest } from 'libs/features/total-rewards/total-rewards-statement/models/request-models';
import { EmployeeRewardsDataService } from 'libs/features/total-rewards/total-rewards-statement/services/employee-rewards-data.service';

import * as fromTotalRewardsReducer from '../reducers';
import * as fromStatementEditActions from '../actions';
import { SaveStatement, SaveSettings } from '../actions';

@Injectable()
export class StatementEditPageEffects {

  @Effect()
  getStatement$: Observable<Action> =
    this.actions$.pipe(
      ofType(fromStatementEditActions.LOAD_STATEMENT),
      switchMap((action: fromStatementEditActions.LoadStatement) =>
        this.totalRewardsApiService.getStatementFromId(action.payload).pipe(
          map((response: Statement) => new fromStatementEditActions.LoadStatementSuccess(response)),
          catchError(error => of(new fromStatementEditActions.LoadStatementError(error)))
        ))
    );

  @Effect()
  public statementChange$: Observable<Action> =
    this.actions$.pipe(
      ofType(
        fromStatementEditActions.UPDATE_STATEMENT_NAME,
        fromStatementEditActions.UPDATE_STATEMENT_CONTROL_TITLE,
        fromStatementEditActions.UPDATE_CALCULATION_CONTROL_FIELD_TITLE,
        fromStatementEditActions.UPDATE_CALCULATION_CONTROL_SUMMARY_TITLE,
        fromStatementEditActions.REMOVE_CALCULATION_CONTROL_COMPENSATION_FIELD,
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
        this.totalRewardsApiService.saveStatement(data.statement).pipe(
          map((statement: Statement) => new fromStatementEditActions.SaveStatementSuccess(statement)),
          catchError(error => of(new fromStatementEditActions.SaveStatementError(error)))
        ))
    );

  @Effect()
  public settingsChange$: Observable<Action> =
    this.actions$.pipe(
      ofType(
        fromStatementEditActions.UPDATE_SETTINGS_FONT_SIZE,
        fromStatementEditActions.UPDATE_SETTINGS_FONT_FAMILY,
        fromStatementEditActions.UPDATE_SETTINGS_CHART_COLOR
      ),
      mapTo(new SaveSettings())
    );

  @Effect()
  saveSettings$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromStatementEditActions.SAVE_SETTINGS),
      withLatestFrom(
        this.store.pipe(select(fromTotalRewardsReducer.selectStatement)),
        (action, statement: Statement) => statement),
      map(statement => ({ StatementId: statement.StatementId, ...statement.Settings } as SaveSettingsRequest)),
      concatMap((saveSettingsRequest: SaveSettingsRequest) =>
        this.totalRewardsApiService.saveStatementSettings(saveSettingsRequest).pipe(
          map((settings: Settings) => new fromStatementEditActions.SaveSettingsSuccess(settings)),
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
          map((settings: Settings) => new fromStatementEditActions.SaveSettingsSuccess(settings)),
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
        return this.companyEmployeeApiService.getBenefits(action.payload.companyEmployeeId)
          .pipe(
            map((response) => {
              return new fromStatementEditActions.GetEmployeeRewardsDataSuccess(EmployeeRewardsDataService.mapEmployeeRewardsDataDateFields(response));
            }),
            catchError(() => of(new fromStatementEditActions.GetEmployeeRewardsDataError()))
          );
      })
    );

  constructor(
    private store: Store<fromTotalRewardsReducer.State>,
    private actions$: Actions,
    private totalRewardsApiService: TotalRewardsApiService,
    private totalRewardsSearchApiService: TotalRewardsSearchApiService,
    private companyEmployeeApiService: CompanyEmployeeApiService
  ) {}
}
