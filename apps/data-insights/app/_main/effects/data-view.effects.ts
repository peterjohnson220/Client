import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { DataViewApiService } from 'libs/data/payfactors-api';

import * as fromDataViewActions from '../actions/data-view.actions';

@Injectable()
export class DataViewEffects {

  @Effect()
  saveUserReport$ = this.action$
    .pipe(
      ofType(fromDataViewActions.SAVE_USER_REPORT),
      switchMap((action: fromDataViewActions.SaveUserReport) => {
        return this.dataViewApiService.saveUserDataView({
          BaseEntityId: action.payload.Entity.Id,
          Name: action.payload.Name,
          Summary: action.payload.Summary,
          RequiredInfo: action.payload.RequiredInfo
        })
          .pipe(
            map((response) => {
              return new fromDataViewActions.SaveUserReportSuccess({ dataViewId: response });
            }),
            catchError((response) => {
              return of(response.status === 409 ?
                new fromDataViewActions.SaveUserReportConflict()
                : new fromDataViewActions.SaveUserReportError());
            })
          );
      })
    );

  @Effect({dispatch: false})
  saveUserReportSuccess$ = this.action$
    .pipe(
      ofType(fromDataViewActions.SAVE_USER_REPORT_SUCCESS),
      tap((action: fromDataViewActions.SaveUserReportSuccess) => {
        this.router.navigate(['custom-report', action.payload.dataViewId]);
      })
    );

  constructor(
    private action$: Actions,
    private dataViewApiService: DataViewApiService,
    private router: Router
  ) {}
}
