import { Injectable } from '@angular/core';
import cloneDeep from 'lodash/cloneDeep';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, catchError, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';

import { ProjectApiService, CompanyEmployeeApiService, TotalRewardsPdfGenerationService } from 'libs/data/payfactors-api';
import * as fromPfDataGridActions from 'libs/features/grids/pf-data-grid/actions';
import * as fromEmployeeManagementActions from 'libs/features/employees/employee-management/actions';
import { TrsConstants } from 'libs/features/total-rewards/total-rewards-statement/constants/trs-constants';
import { DeliveryMethod } from 'libs/features/total-rewards/total-rewards-statement/models/delivery-method';
import { UrlRedirectHelper } from 'libs/core/helpers/url-redirect-helper';
import { PageRedirectUrl } from 'libs/models/url-redirect/page-redirect-url';
import { UrlPage } from 'libs/models/url-redirect/url-page';
import * as fromFeatureFlagRedirectReducer from 'libs/state/state';
import * as fromPfDataGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import * as fromEmployeeManagementReducer from 'libs/features/employees/employee-management/reducers';
import { CompanyEmployee } from 'libs/models';

import * as fromEmployeesPageActions from '../actions/employees-page.actions';
import { EmployeesPageViewId } from '../models';


@Injectable()
export class EmployeesPageEffects {

  @Effect()
  priceJobs$ = this.actions$
    .pipe(
      ofType(fromEmployeesPageActions.PRICE_JOBS),
      withLatestFrom(
        this.store.select(fromFeatureFlagRedirectReducer.getPageRedirectUrl, {page: UrlPage.PricingProject}),
        (action: fromEmployeesPageActions.PriceJobs, redirectUrl: string) => ({action, redirectUrl})
      ),
      switchMap((data: any) => {
        return this.projectsApiService.createFromEmployees(data.action.payload.companyEmployeeIds)
          .pipe(
            mergeMap((projectId: number) => {
              window.location.href = UrlRedirectHelper.getIdParamUrl(data.redirectUrl, projectId.toString());

              return [];
            }),
            catchError(() => of(new fromEmployeesPageActions.PriceJobsError()))
          );
      })
    );

  @Effect()
  deleteEmployee$ = this.actions$
    .pipe(
      ofType(fromEmployeesPageActions.DELETE_EMPLOYEE),
      switchMap((data: any) => {
        return this.companyEmployeesApiService.deleteEmployees(data.payload.companyEmployeeIds).pipe(
          mergeMap(() => [
            new fromEmployeesPageActions.DeleteEmployeeSuccess(),
            new fromPfDataGridActions.ClearSelections(data.payload.pageViewId),
            new fromPfDataGridActions.CloseSplitView(data.payload.pageViewId),
            new fromPfDataGridActions.LoadData(data.payload.pageViewId)
          ]),
          catchError(() => {
            return of(new fromEmployeesPageActions.DeleteEmployeeError());
          })
        );
      })
  );

  @Effect()
  saveEmployeeSuccess$ = this.actions$
    .pipe(
      ofType(fromEmployeeManagementActions.SAVE_EMPLOYEE_SUCCESS),
      withLatestFrom(
        this.store.pipe(select(fromEmployeeManagementReducer.getEmployeeValidationAsync)),
        this.store.pipe(select(fromPfDataGridReducer.getSelectedRow)),
        (action: fromEmployeeManagementActions.SaveEmployeeSuccess, employee, selectedRow) =>
          ({ action, employee, selectedRow})
      ),
      mergeMap(data => {
        const actions = [];
        if (!!data.selectedRow) {
          const updatedSelectedRow = this.mapEmployeeValidationToSelectedRow(data.selectedRow, data.employee.obj.Employee);
          actions.push(new fromPfDataGridActions.UpdateSelectedRow(updatedSelectedRow, EmployeesPageViewId));
        }
        actions.push(new fromPfDataGridActions.LoadData(EmployeesPageViewId));
        return actions;
      })
    );

  @Effect()
  generateStatement$ = this.actions$
    .pipe(
      ofType(fromEmployeesPageActions.GENERATE_STATEMENT),
      map((data: any) => ({
        StatementId: data.payload.statementId,
        CompanyEmployeeIds: data.payload.companyEmployeeIds,
        EmployeeSearchTerm: null,
        ExpectedEmployeeCount: 1,
        GenerateByQuery: null,
        WaitForPdfGenerationSelector: TrsConstants.READY_FOR_PDF_GENERATION_SELECTOR,
        Method: DeliveryMethod.PDFExport,
        EmailTemplate: null,
        UseMockEmployeeRewardsData: false,
        IncludeEmployeeNameInGeneratedFileName: false
      })),
      switchMap(request =>
        this.totalRewardsPdfGenerationService.generateStatements(request).pipe(
          mergeMap((response) => [
            new fromEmployeesPageActions.GenerateStatementSuccess()
          ]),
          catchError(error => of(new fromEmployeesPageActions.GenerateStatementError(error)))
        )
      )
    );

  private mapEmployeeValidationToSelectedRow(selectedRow: any, employee: CompanyEmployee) {
    const updatedSelectedRow = cloneDeep(selectedRow);
    updatedSelectedRow.CompanyEmployees_First_Name = employee.FirstName;
    updatedSelectedRow.CompanyEmployees_Last_Name = employee.LastName;
    return updatedSelectedRow;
  }

  constructor(
    private actions$: Actions,
    private projectsApiService: ProjectApiService,
    private companyEmployeesApiService: CompanyEmployeeApiService,
    private totalRewardsPdfGenerationService: TotalRewardsPdfGenerationService,
    private store: Store<fromFeatureFlagRedirectReducer.State>
  ) {}
}
