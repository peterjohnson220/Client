import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, concatMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { JobDescriptionManagementApiService } from 'libs/data/payfactors-api';

import * as fromCompanyControlsCreateActions from '../actions';
import * as fromCompanyControlsDetailActions from '../../company-controls-detail/actions';
import { CompanyControlConstants } from '../../shared/helpers';

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
              new fromCompanyControlsCreateActions.CreateControlSuccess(),
              new fromCompanyControlsDetailActions.CreateControl({controlName: action.payload.controlName})
            ];
          } else {
            return [
              new fromCompanyControlsCreateActions.CreateControlError(CompanyControlConstants.ControlNameExists)
            ];
          }
        }),
        catchError((error) => of(new fromCompanyControlsCreateActions.CreateControlError(CompanyControlConstants.SaveError)))
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
