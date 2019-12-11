import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, concatMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { JobDescriptionManagementApiService } from 'libs/data/payfactors-api/';
import * as fromCompanyControlActions from '../actions';
import { CompanyControlConstants } from '../../shared/helpers';

@Injectable()
export class CompanyControlDetailEffects {

  @Effect()
  saveControl: Observable<Action> = this.actions$
  .pipe(
    ofType(fromCompanyControlActions.SAVE_CONTROL),
    switchMap((action: fromCompanyControlActions.SaveControl) => {
      return this.jobDescriptionManagementApiService.controlNameExists(action.control.Name).pipe(
        concatMap((response) => {
          if (response === false) {
            return [
              new fromCompanyControlActions.SaveNewControlType(action.control),
            ];
          } else {
            return [
              new fromCompanyControlActions.SaveControlTypeError({errorMessage: CompanyControlConstants.ControlNameExists})
            ];
          }
        }),
        catchError((error) => of(new fromCompanyControlActions.UnhandledError({errorMessage: CompanyControlConstants.SaveError})))
      );
    })
  );


  @Effect()
  saveNewControl$: Observable<Action> = this.actions$.
  pipe(
      ofType(fromCompanyControlActions.SAVE_NEW_CONTROL),
      switchMap((action: fromCompanyControlActions.SaveNewControlType) =>
          this.jobDescriptionManagementApiService.saveControl(action.control).pipe(
              map((response) => {
                  return new fromCompanyControlActions.SaveControlTypeSuccess();
              }),
              catchError((error) => of(new fromCompanyControlActions.UnhandledError(error)))
          )
  ));

  @Effect()
  saveEditedControl$: Observable<Action> = this.actions$.
  pipe(
      ofType(fromCompanyControlActions.SAVE_EDITED_CONTROL),
      switchMap((action: fromCompanyControlActions.SaveEditedControlType) =>
          this.jobDescriptionManagementApiService.saveEditedControl(action.control).pipe(
              map((response) => {
                  return new fromCompanyControlActions.SaveControlTypeSuccess();
              }),
              catchError((error) => of(new fromCompanyControlActions.UnhandledError(error)))
          )
  ));

  @Effect({dispatch: false})
  saveControlSuccess$ = this.actions$
    .pipe(
      ofType(fromCompanyControlActions.SAVE_CONTROL_SUCCESS),
      map(() => {
        this.router.navigate(['settings/company-controls']);
      })
    );

  @Effect({dispatch: false})
  leaveCompanyCOntrolsDetailView$ = this.actions$
    .pipe(
      ofType(fromCompanyControlActions.CLOSE_COMPANY_CONTROLS_DETAIL_VIEW),
      map(() => {
        this.router.navigate(['settings/company-controls']);
      })
    );

  @Effect()
  loadCompanyControlByTypeAndVersion$: Observable<Action> = this.actions$.
  pipe(
      ofType(fromCompanyControlActions.LOAD_COMPANY_CONTROL_BY_TYPE_AND_VERSION),
      switchMap((action: fromCompanyControlActions.LoadCompanyControlByTypeAndVersion) =>
          this.jobDescriptionManagementApiService.getControlByTypeAndVersion(action.payload.type, action.payload.version).pipe(
              map((response: any) => {
                  return new fromCompanyControlActions.LoadCompanyControlByTypeAndVersionSuccess(response);
              }),
              catchError((error) => of(new fromCompanyControlActions.UnhandledError(error)))
          )
  ));

  @Effect()
  openCompanyControlDetailView: Observable<Action> = this.actions$
  .pipe(
    ofType(fromCompanyControlActions.OPEN_COMPANY_CONTORLS_DETAIL_VIEW),
    switchMap((action: fromCompanyControlActions.OpenCompanyControlsDetailView) => {
      return this.jobDescriptionManagementApiService.isControlEditable(action.control.Type).pipe(
        concatMap((response: any) => {
          return [
            new fromCompanyControlActions.OpenCompanyControlsDetailViewSuccess(),
            new fromCompanyControlActions.LoadCompanyControlByTypeAndVersion({type: action.control.Type, version: action.control.ControlVersion}),
            new fromCompanyControlActions.IsControlEditableSuccess(response)
          ];
        }),
        catchError((error) => of(new fromCompanyControlActions.UnhandledError({errorMessage: CompanyControlConstants.UnhandledError})))
      );
    })
  );

  @Effect({dispatch: false})
  openCompanyControlDetailViewSuccess$ = this.actions$
    .pipe(
      ofType(fromCompanyControlActions.OPEN_COMPANY_CONTORLS_DETAIL_VIEW_SUCCESS),
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
