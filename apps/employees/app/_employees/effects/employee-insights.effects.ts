import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';

import {
  ProjectApiService,
  CompanyEmployeeApiService,
  LoaderFieldMappingsApiService
} from 'libs/data/payfactors-api';
import { GenericKeyValue } from 'libs/models';

import * as fromEmployeeInsightsActions from '../actions/employee-insights.actions';


@Injectable()
export class EmployeeInsightsEffects {

  @Effect()
  getEmployeeDetails$ = this.actions$
    .pipe(
      ofType(fromEmployeeInsightsActions.GET_EMPLOYEE_INSIGHTS),
      switchMap((action: any) => {
        return this.companyEmployeesApiService.getEmployeeInsights(action.payload).pipe(
          map((response) => {
            return new fromEmployeeInsightsActions.GetEmployeeInsightsSuccess(response);
          }),
          catchError(() => {
            return of(new fromEmployeeInsightsActions.GetEmployeeInsightsError());
          })
        );
      })
    );

  @Effect()
  loadCustomEmployeeFields = this.actions$
    .pipe(
      ofType(fromEmployeeInsightsActions.LOAD_CUSTOM_EMPLOYEE_FIELDS),
      switchMap((action: any) => {
        return this.loaderFieldMappingsApiService.getCustomEmployeeFields(action.payload)
          .pipe(
            map((response) => {
              const udfFields: GenericKeyValue<string, string>[] = response.map(k => {
                return {
                  Key: k.Key.replace('Name', ''),
                  Value: k.Value
                };
              });
              return new fromEmployeeInsightsActions.LoadCustomEmployeeFieldsSuccess(udfFields);
            }),
          catchError(() => {
            return of(new fromEmployeeInsightsActions.LoadCustomEmployeeFieldsError());
          })
        );
      })
    );

  constructor(
    private actions$: Actions,
    private projectsApiService: ProjectApiService,
    private companyEmployeesApiService: CompanyEmployeeApiService,
    private loaderFieldMappingsApiService: LoaderFieldMappingsApiService
  ) {}
}
