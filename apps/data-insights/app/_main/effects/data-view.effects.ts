import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, tap } from 'rxjs/operators';

import { DataViewApiService } from 'libs/data/payfactors-api';

import * as fromDataViewActions from '../actions/data-view.actions';
import { PayfactorsApiModelMapper } from '../helpers';
import { Entity } from '../models';
import { of } from 'rxjs';


@Injectable()
export class DataViewEffects {

  @Effect()
  getBaseEntities$ = this.action$
  .pipe(
    ofType(fromDataViewActions.GET_BASE_ENTITIES),
    switchMap(() => {
      return this.dataViewApiService.getBaseEntities()
      .pipe(
        map((response) => {
          const baseEntities: Entity[] = PayfactorsApiModelMapper.mapDataViewEntityResponsesToEntities(response);
          return new fromDataViewActions.GetBaseEntitiesSuccess(baseEntities);
        }),
        catchError(() => of(new fromDataViewActions.GetBaseEntitiesError()))
      );
    })
  );

  @Effect()
  saveUserReport$ = this.action$
    .pipe(
      ofType(fromDataViewActions.SAVE_USER_REPORT),
      switchMap((action: fromDataViewActions.SaveUserReport) => {
        return this.dataViewApiService.saveUserDataView({
          BaseEntityId: action.payload.Entity.Id,
          Name: action.payload.Name,
          Summary: action.payload.Summary
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
