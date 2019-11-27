import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { JobDescriptionApiService } from 'libs/data/payfactors-api/jdm';

import * as fromEmployeeAcknowledgementActions from '../actions/employee-acknowledgement.actions';
import { EmployeeAcknowledgement } from '../models';

@Injectable()
export class EmployeeAcknowledgementEffects {
  @Effect()
  acknowledge$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromEmployeeAcknowledgementActions.ACKNOWLEDGE),
      switchMap((action: fromEmployeeAcknowledgementActions.Acknowledge) =>
        this.jobDescriptionApiService.acknowledge(action.payload.signature).pipe(
          map((response: EmployeeAcknowledgement) => {
            return new fromEmployeeAcknowledgementActions.AcknowledgeSuccess(response);
          }),
          catchError( () => of(new fromEmployeeAcknowledgementActions.AcknowledgeError()))
        )
      ));

  @Effect()
  loadEmployeeAcknowledgementInfo$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromEmployeeAcknowledgementActions.LOAD_EMPLOYEE_ACKNOWLEDGEMENT_INFO),
      switchMap((action: fromEmployeeAcknowledgementActions.LoadEmployeeAcknowledgementInfo) =>
        this.jobDescriptionApiService.getEmployeeAcknowledgementInfo().pipe(
          map((response: EmployeeAcknowledgement) => {
            return new fromEmployeeAcknowledgementActions.LoadEmployeeAcknowledgementInfoSuccess(response);
          }),
          catchError(() => of(new fromEmployeeAcknowledgementActions.LoadEmployeeAcknowledgementInfoError()))
        )
      ));

  constructor(
    private actions$: Actions,
    private jobDescriptionApiService: JobDescriptionApiService
  ) {}

}
