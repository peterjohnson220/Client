import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, catchError, map, tap, mergeMap } from 'rxjs/operators';

import { ProjectApiService, CompanyEmployeeApiService, TotalRewardsPdfGenerationService } from 'libs/data/payfactors-api';
import * as fromPfDataGridActions from 'libs/features/grids/pf-data-grid/actions';
import * as fromEmployeeManagementActions from 'libs/features/employees/employee-management/actions';
import { TrsConstants } from 'libs/features/total-rewards/total-rewards-statement/constants/trs-constants';
import { DeliveryMethod } from 'libs/features/total-rewards/total-rewards-statement/models/delivery-method';

import * as fromEmployeesPageActions from '../actions/employees-page.actions';
import { EmployeesPageViewId } from '../models';


@Injectable()
export class EmployeesPageEffects {

  @Effect()
  priceJobs$ = this.actions$
    .pipe(
      ofType(fromEmployeesPageActions.PRICE_JOBS),
      switchMap((action: fromEmployeesPageActions.PriceJobs) => {
        return this.projectsApiService.createFromEmployees(action.payload.companyEmployeeIds)
          .pipe(
            map((projectId: number) => new fromEmployeesPageActions.PriceJobsSuccess({ projectId })),
            catchError(() => of(new fromEmployeesPageActions.PriceJobsError()))
          );
      })
    );

  @Effect({dispatch: false})
  priceJobsSuccess$ = this.actions$
    .pipe(
      ofType(fromEmployeesPageActions.PRICE_JOBS_SUCCESS),
      tap((action: fromEmployeesPageActions.PriceJobsSuccess) => {
        window.location.href = `/marketdata/marketdata.asp?usersession_id=${action.payload.projectId}`;
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
            new fromPfDataGridActions.LoadData(data.payload.pageViewId)
          ]),
          catchError(() => {
            return of(new fromEmployeesPageActions.DeleteEmployeeError());
          })
        );
      })
  );

  @Effect()
  saveEmpoyeeSuccess$ = this.actions$
    .pipe(
      ofType(fromEmployeeManagementActions.SAVE_EMPLOYEE_SUCCESS),
      map(() =>
        new fromPfDataGridActions.LoadData(EmployeesPageViewId)
      )
    );

  @Effect()
  generateStatement$ = this.actions$
    .pipe(
      ofType(fromEmployeesPageActions.GENERATE_STATEMENT),
      map((data: any) => ({
        StatementId: data.payload.statementId,
        CompanyEmployeeIds: data.payload.companyEmployeeIds,
        GenerateByQuery: data.payload.companyEmployeeIds,
        WaitForPdfGenerationSelector: TrsConstants.READY_FOR_PDF_GENERATION_SELECTOR,
        Method: DeliveryMethod.PDFExport,
        EmailTemplate: null
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

  constructor(
    private actions$: Actions,
    private projectsApiService: ProjectApiService,
    private companyEmployeesApiService: CompanyEmployeeApiService,
    private totalRewardsPdfGenerationService: TotalRewardsPdfGenerationService,
  ) {}
}
