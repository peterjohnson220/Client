import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, concatMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { JobDescriptionManagementApiService, JobDescriptionTemplateApiService } from 'libs/data/payfactors-api';

import * as fromCompanyControlsActions from '../actions';

@Injectable()
export class CompanyControlsDeleteEffects {

    @Effect()
    deleteCompanyControls: Observable<Action> = this.actions$
    .pipe(
        ofType(fromCompanyControlsActions.DELETE_CONTROL),
        switchMap((action: fromCompanyControlsActions.DeleteControl) =>
            this.jobDescriptionManagementApiService.inactivateControl(action.payload.controlType)
            .pipe(
                map(() => {
                    return new fromCompanyControlsActions.DeleteControlSuccess();
                }),
                catchError(() => of(new fromCompanyControlsActions.DeleteControlError('Error deleting control.')))
            )
        )
    );

    @Effect()
    loadTemplateWithControlType: Observable<Action> = this.actions$
    .pipe(
      ofType(fromCompanyControlsActions.LOAD_TEMPLATES_WITH_CONTROL_TYPE),
      switchMap((action: fromCompanyControlsActions.LoadTemplatesWithControlType) =>
        this.jobDescriptionTemplateApiService.getTemplatesWithControlType(action.payload.controlType).pipe(
          map((response: any) => {
            return new fromCompanyControlsActions.LoadTemplatesWithControlTypeSuccess(response);
          }),
          catchError(() => of(new fromCompanyControlsActions.LoadTemplatesWithControlTypeError()))
        )
      ));

    @Effect()
    deleteCompanyControlsSuccess: Observable<Action> = this.actions$
    .pipe(
        ofType(fromCompanyControlsActions.DELETE_CONTROL_SUCCESS),
        concatMap((response) => {
            return [
                new fromCompanyControlsActions.CloseDeleteControlModal(),
                new fromCompanyControlsActions.LoadCompanyControls()
              ];
          })
    );

  constructor(
    private actions$: Actions,
    private jobDescriptionManagementApiService: JobDescriptionManagementApiService,
    private jobDescriptionTemplateApiService: JobDescriptionTemplateApiService
  ) {}
}
