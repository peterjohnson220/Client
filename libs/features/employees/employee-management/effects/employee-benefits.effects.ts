import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, switchMap, catchError, mergeMap, withLatestFrom } from 'rxjs/operators';

import { CompanyEmployeeApiService } from 'libs/data/payfactors-api';
import { SaveEmployeeBenefitsRequest } from 'libs/models/payfactors-api/employees';

import * as fromEmployeeManagementReducer from '../reducers';
import * as fromEmployeeBenefitsActions from '../actions/employee-benefits.actions';
import * as fromEmployeeManagementActions from '../actions/employee-management.actions';

@Injectable()
export class EmployeeBenefitEffects {
  constructor(
    private actions$: Actions,
    private companyEmployeeServiceApi: CompanyEmployeeApiService,
    private store: Store<fromEmployeeManagementReducer.State>
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
  loadNewEmployeeBenefits$ = this.actions$
    .pipe(
      ofType(fromEmployeeBenefitsActions.LOAD_NEW_EMPLOYEE_BENEFITS),
      switchMap((action: fromEmployeeBenefitsActions.LoadNewEmployeeBenefits) => {
        return this.companyEmployeeServiceApi.getNewEmployeeBenefits()
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
      withLatestFrom(
        this.store.select(fromEmployeeManagementReducer.getEmployeeBenefits),
        (action: fromEmployeeBenefitsActions.SaveEmployeeBenefits, benefits) => ({ action, benefits })
      ),
      switchMap((data) => {
        const request: SaveEmployeeBenefitsRequest = {
          CompanyEmployeeId: data.action.companyEmployeeId,
          EmployeeId: data.action.employeeId,
          Benefits: data.benefits
        };
        return this.companyEmployeeServiceApi.saveEmployeeBenefits(request)
          .pipe(
            mergeMap(() => [
              new fromEmployeeBenefitsActions.SaveEmployeeBenefitsSuccess(),
              new fromEmployeeManagementActions.SaveEmployeeSuccess()
            ]),
            catchError(() => of(new fromEmployeeBenefitsActions.LoadEmployeeBenefitsError()))
          );
      })
    );
}
