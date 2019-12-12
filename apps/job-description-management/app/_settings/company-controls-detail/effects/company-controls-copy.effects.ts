import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { JobDescriptionManagementApiService } from 'libs/data/payfactors-api/';

import * as fromCompanyControlActions from '../actions';
import { CompanyControlConstants } from '../../shared/helpers';

@Injectable()
export class CompanyControlCopyEffects {

    @Effect()
    copyCompanyControls: Observable<Action> = this.actions$
    .pipe(
      ofType(fromCompanyControlActions.COPY_COMPANY_CONTROL),
      switchMap((action: fromCompanyControlActions.CopyCompanyControl) => {
        return this.jobDescriptionManagementApiService.controlNameExists(action.payload.controlName).pipe(
          map((response) => {
            if (response === false) {
              return new fromCompanyControlActions.CopyCompanyControlSuccess();
            } else {
              return new fromCompanyControlActions.CopyCompanyControlError({errorMessage: CompanyControlConstants.ControlNameExists});
            }
          })
        );
      })
    );

    @Effect({dispatch: false})
    addViewSuccess$ = this.actions$
      .pipe(
        ofType(fromCompanyControlActions.COPY_COMPANY_CONTROL_SUCCESS),
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
