import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, concatMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { JobDescriptionManagementApiService } from 'libs/data/payfactors-api';

import * as fromCompanyControlsCreateActions from '../actions';

@Injectable()
export class CompanyControlsCreateEffects {

  @Effect()
  createCompanyControls: Observable<Action> = this.actions$
  .pipe(
    ofType(fromCompanyControlsCreateActions.CREATE_CONTROL),
    switchMap((action: fromCompanyControlsCreateActions.CreateControl) => {
      return this.jobDescriptionManagementApiService.controlNameExists(action.payload.controlName).pipe(
        concatMap((response) => {
          if (response === false) {
            return [
              // Other actions will be added
              new fromCompanyControlsCreateActions.CreateControlSuccess()
            ];
          } else {
            return [
              new fromCompanyControlsCreateActions.CreateControlError('Control name is not available.')
            ];
          }
        }),
        catchError((error) => of(new fromCompanyControlsCreateActions.CreateControlError('Error creating control.')))
      );
    })
  );

  @Effect({dispatch: false})
  addViewSuccess$ = this.actions$
    .pipe(
      ofType(fromCompanyControlsCreateActions.CREATE_CONTROL_SUCCESS),
      map(() => {
        this.router.navigate(['settings/company-controls/detail']);
      })
    );

  constructor(
    private actions$: Actions,
    private jobDescriptionManagementApiService: JobDescriptionManagementApiService,
    private router: Router
  ) {}
}
