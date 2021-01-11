import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { TagApiService } from 'libs/data/payfactors-api';
import { LoaderFieldMappingsApiService } from 'libs/data/payfactors-api/data-loads/index';

import * as fromCustomFieldsActions from '../actions/custom-fields.actions';

@Injectable()
export class CustomFieldsEffect {
  @Effect()
  getCustomJobFields$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromCustomFieldsActions.GET_CUSTOM_JOB_FIELDS),
      switchMap((action: fromCustomFieldsActions.GetCustomJobFields) =>
        this.loaderFieldMappingsApiService.getCustomJobFields(action.payload).pipe(
          map((jobFields: any) => {
            return new fromCustomFieldsActions.GetCustomJobFieldsSuccess(jobFields);
          }),
          catchError(error => of(new fromCustomFieldsActions.GetCustomJobFieldsError()))
        )
      )
    );
  @Effect()
  getCustomEmployeeFields$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromCustomFieldsActions.GET_CUSTOM_EMPLOYEE_FIELDS),
      switchMap((action: fromCustomFieldsActions.GetCustomEmployeeFields) =>
        this.loaderFieldMappingsApiService.getCustomEmployeeFields(action.payload).pipe(
          map((employeeFields: any) => {
            return new fromCustomFieldsActions.GetCustomEmployeeFieldsSuccess(employeeFields);
          }),
          catchError(error => of(new fromCustomFieldsActions.GetCustomEmployeeFieldsError()))
        )
      )
    );

  @Effect()
  getEmployeeTags$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromCustomFieldsActions.GET_TAGCATEGORIES),
      switchMap((action: fromCustomFieldsActions.GetTagCategories) =>
        this.tagApi.getEmployeeTagCategoriesForCompany(action.companyId).pipe(
          map((employeeFields: any) => {
            return new fromCustomFieldsActions.GetTagCategoriesSuccess(employeeFields);
          }),
          catchError(error => of(new fromCustomFieldsActions.GetTagCategoriesError()))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private loaderFieldMappingsApiService: LoaderFieldMappingsApiService,
    private tagApi: TagApiService
  ) { }
}
