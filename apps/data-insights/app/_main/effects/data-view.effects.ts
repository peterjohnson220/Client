import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, tap, mergeMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { orderBy } from 'lodash';

import { DataViewApiService } from 'libs/data/payfactors-api';

import * as fromDataViewActions from '../actions/data-view.actions';
import * as fromDataViewGridActions from '../actions/data-view-grid.actions';
import { PayfactorsApiModelMapper } from '../helpers';
import { Entity } from '../models';
import { select, Store } from '@ngrx/store';
import * as fromDataViewReducer from '../reducers';

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

  @Effect()
  editUserReport$ = this.action$
    .pipe(
      ofType(fromDataViewActions.EDIT_USER_REPORT),
      withLatestFrom(
        this.store.pipe(select(fromDataViewReducer.getUserDataViewAsync)),
        (action: fromDataViewActions.EditUserReport, userDataView) =>
          ({ action, userDataView })
      ),
      switchMap((data) => {
        return this.dataViewApiService.editUserDataView({
          UserDataViewId: data.userDataView.obj.UserDataViewId,
          Name: data.action.payload.Name,
          Summary: data.action.payload.Summary
        })
          .pipe(
            map(() => {
              return new fromDataViewActions.EditUserReportSuccess(data.action.payload);
            }),
            catchError((response) => {
              return of(response.status === 409 ?
                new fromDataViewActions.EditUserReportConflict()
                : new fromDataViewActions.EditUserReportError());
            })
          );
      })
    );

  @Effect()
  duplicateUserReport$ = this.action$
    .pipe(
      ofType(fromDataViewActions.DUPLICATE_USER_REPORT),
      withLatestFrom(
        this.store.pipe(select(fromDataViewReducer.getUserDataViewAsync)),
        (action: fromDataViewActions.DuplicateUserReport, userDataView) =>
          ({ action, userDataView })
      ),
      switchMap((data) => {
        return this.dataViewApiService.duplicateUserDataView({
          UserDataViewId: data.userDataView.obj.UserDataViewId,
          Name: data.action.payload.Name,
          Summary: data.action.payload.Summary
        })
          .pipe(
            map((response) => {
              return new fromDataViewActions.DuplicateUserReportSuccess({ dataViewId: response });
            }),
            catchError((response) => {
              return of(response.status === 409 ?
                new fromDataViewActions.DuplicateUserReportConflict()
                : new fromDataViewActions.DuplicateUserReportError());
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

  @Effect({dispatch: false})
  duplicateUserReportSuccess$ = this.action$
    .pipe(
      ofType(fromDataViewActions.DUPLICATE_USER_REPORT_SUCCESS),
      tap((action: fromDataViewActions.DuplicateUserReportSuccess) => {
        this.router.navigate(['custom-report', action.payload.dataViewId]);
      })
    );

  @Effect()
  getUserDataView$ = this.action$
    .pipe(
      ofType(fromDataViewActions.GET_USER_DATA_VIEW),
      switchMap((action: fromDataViewActions.GetUserDataView) => {
        return this.dataViewApiService.getUserDataView(action.payload.dataViewId)
          .pipe(
            map((response) => {
              const userDataView = PayfactorsApiModelMapper.mapUserDataViewResponseToUserDataView(response);
              return new fromDataViewActions.GetUserDataViewSuccess(userDataView);
            }),
            catchError(() => of(new fromDataViewActions.GetUserDataViewError()))
          );
      })
    );

  @Effect()
  getReportFields$ = this.action$
  .pipe(
    ofType(fromDataViewActions.GET_REPORT_FIELDS),
    switchMap((action: fromDataViewActions.GetReportFields) => {
      return this.dataViewApiService.getUserDataViewFields(action.payload.dataViewId)
      .pipe(
        mergeMap((response) => [
            new fromDataViewActions.GetReportFieldsSuccess(
              PayfactorsApiModelMapper.mapDataViewFieldsToFields(response)),
            new fromDataViewGridActions.GetData()
          ]
        ),
        catchError(() => of(new fromDataViewActions.GetReportFieldsError()))
      );
    })
  );

  @Effect()
  removeSelectedField$ = this.action$
    .pipe(
      ofType(fromDataViewActions.REMOVE_SELECTED_FIELD),
      map(() => {
        return new fromDataViewActions.SaveReportFields();
      })
    );

  @Effect()
  saveReportFields$ = this.action$
    .pipe(
      ofType(fromDataViewActions.SAVE_REPORT_FIELDS),
      withLatestFrom(
        this.store.pipe(select(fromDataViewReducer.getUserDataViewAsync)),
        this.store.pipe(select(fromDataViewReducer.getSelectedFields)),
        (action: fromDataViewActions.SaveReportFields, userDataView, selectedFields) =>
          ({ userDataView, selectedFields })
      ),
      switchMap((data) => {
        const selectedFields = orderBy(data.selectedFields, 'Order');
        const fieldsToSave = selectedFields.map((f, index) => {
          return {
            DataElementId: f.DataElementId,
            Order: index + 1,
            DisplayName: f.DisplayName
          };
        });
        return this.dataViewApiService.updateDataViewFields({
          UserDataViewId: data.userDataView.obj.UserDataViewId,
          Fields: fieldsToSave
        })
          .pipe(
            map(() => {
              return new fromDataViewActions.SaveReportFieldsSuccess();
            }),
            catchError(() => {
              return of(new fromDataViewActions.SaveReportFieldsError());
            })
          );
      })
    );

  @Effect()
  reorderFields$ = this.action$
  .pipe(
    ofType(fromDataViewActions.REORDER_FIELDS),
    map(() => {
      return new fromDataViewActions.SaveReportFields();
    })
  );

  constructor(
    private action$: Actions,
    private store: Store<fromDataViewReducer.State>,
    private dataViewApiService: DataViewApiService,
    private router: Router
  ) {}
}
