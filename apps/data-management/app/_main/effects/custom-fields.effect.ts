import {Injectable} from '@angular/core';

import {Actions, Effect, ofType} from '@ngrx/effects';
import {Observable, of} from 'rxjs';
import {Action} from '@ngrx/store';
import {catchError, map, switchMap} from 'rxjs/operators';

import {LoaderFieldMappingsApiService} from 'libs/data/payfactors-api/data-loads/index';

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

  constructor(
    private actions$: Actions,
    private loaderFieldMappingsApiService: LoaderFieldMappingsApiService
  ) {}
}
