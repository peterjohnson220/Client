import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, catchError, map, tap, mergeMap } from 'rxjs/operators';

import { ProjectApiService, CompanyEmployeeApiService } from 'libs/data/payfactors-api';
import * as fromPfDataGridActions from 'libs/features/pf-data-grid/actions';
import * as fromEmployeeManagementActions from 'libs/features/employee-management/actions';

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

  constructor(
    private actions$: Actions,
    private projectsApiService: ProjectApiService,
    private companyEmployeesApiService: CompanyEmployeeApiService
  ) {}
}
