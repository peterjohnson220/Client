import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { CompanyEmployeeApiService } from 'libs/data/payfactors-api';

import * as fromEmployeeSalaryRangeChartActions from '../actions/employee-salary-range-chart.actions';

@Injectable()
export class EmployeeSalaryRangeChartEffects {

  constructor(
    private companyEmployeeApiService: CompanyEmployeeApiService,
    private actions$: Actions
  ) {}

  @Effect()
  getEmployeeStructures$ = this.actions$
    .pipe(
      ofType(fromEmployeeSalaryRangeChartActions.GET_EMPLOYEE_STRUCTURES),
      switchMap((action: fromEmployeeSalaryRangeChartActions.GetEmployeeStructures) => {
        return this.companyEmployeeApiService.getStructureNames(
          action.payload.CompanyJobId, action.payload.CompanyPayMarketId, action.payload.CompanyEmployeeId
        ).pipe(
          map((response) => new fromEmployeeSalaryRangeChartActions.GetEmployeeStructuresSuccess(response)),
          catchError(() => of(new fromEmployeeSalaryRangeChartActions.GetEmployeeStructuresError()))
        );
      })
    );
}
