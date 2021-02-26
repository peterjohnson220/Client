import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, switchMap, catchError } from 'rxjs/operators';

import { CompanyEmployeeApiService } from 'libs/data/payfactors-api';

import * as fromEmployeeBenefitsActions from '../actions/employee-benefits.actions';

@Injectable()
export class EmployeeBenefitEffects {
  constructor(
    private actions$: Actions,
    private companyEmployeeServiceApi: CompanyEmployeeApiService
  ) {}

  @Effect()
  loadEmployeeBenefits$ = this.actions$
    .pipe(
      ofType(fromEmployeeBenefitsActions.LOAD_EMPLOYEE_BENEFITS),
      switchMap((action: fromEmployeeBenefitsActions.LoadEmployeeBenefits) => {
        return this.companyEmployeeServiceApi.getEmployeeBenefits(action.payload.companyEmployeeId, action.payload.employeeId)
          .pipe(
            map((response) => new fromEmployeeBenefitsActions.LoadEmployeeBenefitsSuccess(response)),
            catchError(() => of(new fromEmployeeBenefitsActions.LoadEmployeeBenefitsError()))
          );
      })
    );

  @Effect()
  saveEmployeeBenefits$ = this.actions$
    .pipe(
      ofType(fromEmployeeBenefitsActions.SAVE_EMPLOYEE_BENEFITS),
      switchMap((action: fromEmployeeBenefitsActions.SaveEmployeeBenefits) => {
        return this.companyEmployeeServiceApi.saveEmployeeBenefits(action.payload)
          .pipe(
            map(() => new fromEmployeeBenefitsActions.SaveEmployeeBenefitsSuccess()),
            catchError(() => of(new fromEmployeeBenefitsActions.LoadEmployeeBenefitsError()))
          );
      })
    );
}
